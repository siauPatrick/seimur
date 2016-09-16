from collections import OrderedDict
from os.path import basename
from urllib.parse import urlparse
import json
import pickle

from fuzzywuzzy import fuzz
from pyspark import SparkContext
from pyspark.mllib.classification import LogisticRegressionWithSGD
from pyspark.mllib.evaluation import BinaryClassificationMetrics
from pyspark.mllib.regression import LabeledPoint
from scipy.stats import entropy


def _unpickle_pairs():
    with open('/Users/siauz/Projects/ah/seimur/training_pairs', 'rb') as f:
        return pickle.load(f)


def age_diff(age1, age2):
    if age1 is None or age2 is None:
        return 0
    elif age1 == age2:
        return 1
    else:
        return min(age1, age2) / max(age1, age2)


def first_company_diff(positions1, positions2):
    company_diffs = []
    for i in range(1, 3):
        company_name1 = positions1[-i]['companyName'] or '' if len(positions1) >= i else ''
        company_name2 = positions2[-i]['companyName'] or '' if len(positions2) >= i else ''
        diff = fuzz.partial_ratio(company_name1, company_name2) / 100
        company_diffs.append(diff)

    return max(company_diffs)


def last_company_diff(positions1, positions2):
    company_diffs = []
    for i in range(2):
        company_name1 = positions1[i]['companyName'] or '' if len(positions1) >= i + 1 else ''
        company_name2 = positions2[i]['companyName'] or '' if len(positions2) >= i + 1 else ''
        diff = fuzz.partial_ratio(company_name1, company_name2) / 100
        company_diffs.append(diff)

    return max(company_diffs)


def last_educations_diff(education1, education2):
    education_name1 = education1[0]['nameRaw'] or '' if education1 else ''
    education_name2 = education2[0]['nameRaw'] or '' if education2 else ''

    return fuzz.partial_ratio(education_name1, education_name2) / 100


def is_same_resource(sources1, sources2):
    host1 = urlparse(sources1[0]).hostname
    host2 = urlparse(sources2[0]).hostname

    resource1 = host1.split('.')[-2] if '.' in host1 else host1
    resource2 = host2.split('.')[-2] if '.' in host2 else host2

    return resource1 == resource2


def process_batch(batch, is_train=False):
    p1 = batch['first'] if is_train else batch['up1']
    p2 = batch['second'] if is_train else batch['up2']

    features = OrderedDict([
        ('age_diff', age_diff(p1['age'], p2['age'])),
        ('first_company_diff', first_company_diff(p1['positions'], p2['positions'])),
        ('last_company_diff', last_company_diff(p1['positions'], p2['positions'])),
        ('last_educations_diff', last_educations_diff(p1['educations'], p2['educations'])),
        ('is_same_resource', is_same_resource(p1['sources'], p2['sources']))
    ])

    if is_train:
        features['is_same'] = 1 if batch['label'] == 1 else 0

    return features


def to_labeled_point(features_and_label):
    label = features_and_label.pop('is_same')
    features = list(features_and_label.values())
    return LabeledPoint(label, features)


def train_committee(train_features, test_features, size=5):
    committee = []
    attempts = 0
    max_attempts = size * 4
    roc_threshold = 0.7

    test_pairs_features = test_features.map(lambda p: process_batch(p, is_train=True))
    test_labeled_pairs = test_pairs_features.map(to_labeled_point)

    while len(committee) < size and attempts < max_attempts:
        attempts += 1

        pairs_features = train_features.map(lambda p: process_batch(p, is_train=True))
        labeled_points = pairs_features.map(to_labeled_point).sample(True, 1)

        model = LogisticRegressionWithSGD.train(labeled_points)
        model.clearThreshold()
        scores_and_labels = test_labeled_pairs.map(lambda p: (model.predict(p.features), p.label))

        metrics = BinaryClassificationMetrics(scores_and_labels)
        if metrics.areaUnderROC > roc_threshold:
            print(attempts, metrics.areaUnderROC)
            committee.append(model)

    return committee


def _pair_to_id(pair):
    return '_'.join(map(str, sorted([pair['up1']['docId'], pair['up2']['docId']])))


def average_kl(predicts):
    predicts_number = len(predicts)

    consensus_probability_of_same = sum(predicts) / predicts_number
    consensus_probability = (consensus_probability_of_same, 1 - consensus_probability_of_same)

    return sum(entropy((p, 1 - p), consensus_probability) for p in predicts) / predicts_number


def get_unsure_pairs(committee, pairs):
    pairs_features = pairs.map(lambda p: (_pair_to_id(p), process_batch(p, is_train=False)))
    predicts = pairs_features.mapValues(lambda p: list(map(lambda c: c.predict(list(p.values())), committee)))
    kl_distances = predicts.mapValues(lambda p: average_kl(p))
    return kl_distances.takeOrdered(10, key=lambda p: -p[1])


if __name__ == '__main__':
    sc = SparkContext(appName=basename(__file__))

    unpickled_pairs_dict = _unpickle_pairs()
    unpickled_pairs = [
        unpickled_pairs_dict[id]
        for id in sorted(unpickled_pairs_dict)
        if unpickled_pairs_dict[id].get('label')
    ]

    train_pairs = sc.parallelize(unpickled_pairs[20:])
    test_pairs = sc.parallelize(unpickled_pairs[:20])
    committee = train_committee(train_pairs, test_pairs, 10)

    pairs = sc.textFile('/Users/siauz/min_pairs').map(json.loads)
    unsure_pairs = get_unsure_pairs(committee, pairs)
    print(unsure_pairs)

    sc.stop()

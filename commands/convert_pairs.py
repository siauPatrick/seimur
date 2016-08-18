from collections import OrderedDict
from os.path import basename
from urllib.parse import urlparse
import pickle

from fuzzywuzzy import fuzz
from pyspark import SparkContext
from pyspark.mllib.classification import LogisticRegressionWithSGD
from pyspark.mllib.evaluation import BinaryClassificationMetrics
from pyspark.mllib.regression import LabeledPoint


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
    host1 = urlparse(sources1[0]).hostname.split('.')[-2]
    host2 = urlparse(sources2[0]).hostname.split('.')[-2]

    return host1 == host2


def process_batch(batch, is_train=False):
    p1 = batch['first']
    p2 = batch['second']

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


if __name__ == '__main__':
    sc = SparkContext(appName=basename(__file__))

    unpickled_pairs = _unpickle_pairs()
    train_pairs = (unpickled_pairs[id] for id in sorted(unpickled_pairs)[:20])
    test_pairs = (unpickled_pairs[id] for id in sorted(unpickled_pairs)[20:])

    train_pairs = sc.parallelize(train_pairs).filter(lambda p: p.get('label'))
    pairs_features = train_pairs.map(lambda p: process_batch(p, is_train=True))
    labeled_points = pairs_features.map(to_labeled_point)
    model = LogisticRegressionWithSGD.train(labeled_points)
    model.clearThreshold()

    test_pairs_features = sc.parallelize(test_pairs).map(lambda p: process_batch(p, is_train=True))
    test_labeled_pairs = test_pairs_features.map(to_labeled_point)
    scores_and_labels = test_labeled_pairs.map(lambda p: (model.predict(p.features), p.label))

    metrics = BinaryClassificationMetrics(scores_and_labels)
    print(metrics.areaUnderROC)

    sc.stop()

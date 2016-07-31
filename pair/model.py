from datetime import datetime
import json
import pickle

from aiohttp import web


def _unpickle_pairs():
    with open('training_pairs', 'rb') as f:
        return pickle.load(f)


def _pickle_pairs(pairs):
    with open('training_pairs', 'wb') as f:
        pickle.dump(pairs, f, pickle.HIGHEST_PROTOCOL)


def _pair_key_to_id(p_key):
    return '_'.join(map(str, sorted(p_key)))


def _pair_id_to_key(p_id):
    return tuple(sorted(int(p) for p in p_id.split('_')))


def get_pair_list():
    pairs = _unpickle_pairs()
    return [
        {**p_value, 'id': _pair_key_to_id(p_key)}
        for p_key, p_value in pairs.items()
    ]


def get_pair(pair_id):
    pairs = _unpickle_pairs()
    pair_key = _pair_id_to_key(pair_id)
    pair = pairs.get(pair_key)

    if pair is None:
        body = str.encode(json.dumps({'detail': 'Not found'}))
        raise web.HTTPNotFound(body=body, content_type='application/json')
    else:
        pair['id'] = _pair_key_to_id(pair_key)
        return pair


def set_pair_label(pair_id, label):
    pair = get_pair(pair_id)
    pair['label'] = label
    pair['modified_date'] = datetime.utcnow().isoformat()

    pair_key = _pair_id_to_key(pair_id)
    pairs = _unpickle_pairs()
    pairs[pair_key] = pair

    _pickle_pairs(pairs)

import pickle

from aiohttp import web


class PairListCreateAPIView(web.View):
    async def get(self):
        """
        получение списка пар профилей
        """
        with open('training_pairs', 'rb') as f:
            pairs = pickle.load(f)

        pairs_list = []
        for p_key, p_value in pairs.items():
            p_value['id'] = '_'.join(map(str, sorted(p_key)))
            pairs_list.append(p_value)

        return web.json_response(pairs_list)

    async def post(self):
        """
        создание новой пары
        """
        return web.json_response({'view': 'POST:PairListCreateAPIView'})


class PairRetrieveUpdateAPIView(web.View):
    async def get(self):
        """
        получение пары профилей
        """
        with open('training_pairs', 'rb') as f:
            pairs = pickle.load(f)

        pair_id_param = self.request.match_info.get('pair_id')
        pair_id = tuple(sorted(int(p) for p in pair_id_param.split('_')))
        pair = pairs.get(pair_id)

        if pair is None:
            return web.json_response({'detail': 'Not found'}, status=404)
        else:
            return web.json_response(pair)

    async def put(self):
        """
        установка или изменение метки пары
        """
        json_body = await self.request.json()

        with open('training_pairs', 'rb') as f:
            pairs = pickle.load(f)

        pair_id_param = self.request.match_info.get('pair_id')
        pair_id = tuple(sorted(int(p) for p in pair_id_param.split('_')))
        pair = pairs.get(pair_id)

        if pair is None:
            return web.json_response({'detail': 'Not found'}, status=404)
        else:
            pair['label'] = json_body['label']
            pairs[pair_id] = pair
            if 'same' in pair:
                del pair['same']

            with open('training_pairs', 'wb') as f:
                pickle.dump(pairs, f, pickle.HIGHEST_PROTOCOL)

            return web.json_response(pair)
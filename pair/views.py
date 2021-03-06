from datetime import datetime

from aiohttp import web

from pair.model import get_pair_list, get_pair, set_pair_label


class IndexView(web.View):
    async def get(self):
        body = """
        <head>
          <meta charset="UTF-8">
          <title>Seimur</title>
          <link rel="stylesheet" href="/static/style.css">
          <script type="text/javascript" src="/static/bundle.js" defer></script>
        </head>
        <body class="page">
          <section id="seimur-app"></section>
        </body>
        """
        return web.Response(body=body.encode('utf-8'), headers={'Content-type': 'text/html'})


class PairListCreateAPIView(web.View):
    async def get(self):
        """
        получение списка пар профилей
        """
        pair_list = get_pair_list()
        now = datetime.utcnow().isoformat()
        sorted_pair_list = sorted(
            pair_list,
            reverse=True,
            key=lambda p: p.get('modified_date', now)
        )
        return web.json_response(sorted_pair_list)

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
        pair_id = self.request.match_info.get('pair_id')
        pair = get_pair(pair_id)
        return web.json_response(pair)

    async def put(self):
        """
        установка или изменение метки пары
        """
        json_body = await self.request.json()
        pair_id = self.request.match_info.get('pair_id')
        set_pair_label(pair_id, json_body['label'])
        pair = get_pair(pair_id)
        return web.json_response(pair)
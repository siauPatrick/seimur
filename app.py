from aiohttp import web

from views import PairListCreateAPIView, PairRetrieveUpdateAPIView


app = web.Application()
app.router.add_route('*', '/api/pairs', PairListCreateAPIView)
app.router.add_route('*', '/api/pairs/{pair_id:\d+_\d+}', PairRetrieveUpdateAPIView)

web.run_app(app)

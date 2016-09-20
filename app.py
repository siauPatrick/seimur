from aiohttp import web

from config import settings
from pair.views import IndexView, PairListCreateAPIView, PairRetrieveUpdateAPIView


def init_func(*argv):
    app = web.Application()
    app.router.add_route('GET', '/', IndexView)
    app.router.add_route('GET', '/pairs', IndexView)
    app.router.add_route('GET', '/pairs/{pair_id:\d+_\d+}', IndexView)
    app.router.add_route('*', '/api/pairs', PairListCreateAPIView)
    app.router.add_route('*', '/api/pairs/{pair_id:\d+_\d+}', PairRetrieveUpdateAPIView)
    app.router.add_static('/static/', path=settings.STATIC_ROOT, name='static')

    return app

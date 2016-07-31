from os.path import normpath, join, abspath
import logging

from aiohttp import web

from views import IndexView, PairListCreateAPIView, PairRetrieveUpdateAPIView


ROOT_DIR = normpath(join(abspath(__file__), '../'))
logging.basicConfig(level=logging.DEBUG)

app = web.Application()
app.router.add_route('GET', '/', IndexView)
app.router.add_route('GET', '/pairs/{pair_id:\d+_\d+}', IndexView)
app.router.add_route('*', '/api/pairs', PairListCreateAPIView)
app.router.add_route('*', '/api/pairs/{pair_id:\d+_\d+}', PairRetrieveUpdateAPIView)
app.router.add_static('/static/', path=normpath(join(ROOT_DIR, './gui/dist/')), name='static')

web.run_app(app)

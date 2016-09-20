from os import mkdir
from os.path import normpath, join, abspath, isdir
import multiprocessing


SRC_DIR = normpath(join(abspath(__file__), '../../'))
LOG_DIR = normpath(join(SRC_DIR, '../logs'))
if not isdir(LOG_DIR):
    mkdir(LOG_DIR)

bind = 'unix:{}'.format(normpath(join(SRC_DIR, '../seimur.sock')))

worker_class = 'aiohttp.worker.GunicornWebWorker'
workers = multiprocessing.cpu_count() * 2 + 1

accesslog = normpath(join(LOG_DIR, 'access.log'))
errorlog = normpath(join(LOG_DIR, 'error.log'))

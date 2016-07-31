from os.path import normpath, join, abspath
import logging


logging.basicConfig(level=logging.DEBUG)

ROOT_DIR = normpath(join(abspath(__file__), '../'))
DATABASE = normpath(join(ROOT_DIR, './training_pairs'))
STATIC_ROOT = normpath(join(ROOT_DIR, './gui/dist'))

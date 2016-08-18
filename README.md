# seimur

Active learning framework for finding same social account.

## dev start

Install python3.5
```
brew install python3
```

Create virtualenv
```
python3 -m venv ~/.envs/siemur
```

Activate virtualenv
```
source ~/.envs/siemur/bin/activate
```

Install python requirements
```
pip install -r requirements.txt
```

Install nodejs
```
brew install node
```

Install nodejs requirements
```
cd gui && npm i
```

Build bundle.js and start watcher
```
npm run build-dev
```

Run aiohttp server
```bash
python app.py
```

Open localhost:8080 in browser 

Run CSScomb
```
npm run csscomb
```

Run local spark
```
source ~/anaconda/bin/activate root
PYSPARK_PYTHON=/Users/siauz/anaconda/bin/python3 IPYTHON=1 IPYTHON_OPTS="notebook" ~/spark/bin/pyspark
```


Enable PyCharm support for Spark
```
Preferences -> Project -> Interpretator -> More -> Path
add spark/python
```
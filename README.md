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


## useful commands

Run CSScomb
```
npm run csscomb
```

Run local spark
```
source ~/anaconda/bin/activate root
PYSPARK_PYTHON=/Users/siauz/anaconda/bin/python3 IPYTHON=1 IPYTHON_OPTS="notebook" ~/spark/bin/pyspark
```


Run spark app

```
# run in anaconda env
~/spark/bin/spark-submit commands/convert_pairs.py
```


Enable PyCharm support for Spark
```
Preferences -> Project -> Interpretator -> More -> Path
add spark/python
```


Vagrant
```
java: http://arturmkrtchyan.com/apache-spark-hidden-rest-api
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer


spark: http://spark.apache.org/downloads.html
wget -q http://d3kbcqa49mib13.cloudfront.net/spark-2.0.0-bin-hadoop2.7.tgz -P /tmp
tar zxf /tmp/spark-2.0.0-bin-hadoop2.7.tgz && mv spark-2* spark


python
apt-get install python3-venv
python3 -m venv envs/seimur
```

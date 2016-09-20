#!/usr/bin/env bash

VAGRANT_HOME_PATH='/home/vagrant'
PRJ_NAME=$1


function startup()
{

    # postgreSQL
    sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

    apt-get update -y
}


function install_python()
{
    apt-get install -y python3-venv

    VIRTUALENV_PATH="$VAGRANT_HOME_PATH/.env/$PRJ_NAME"
    su -l vagrant -c "python3 -m venv $VIRTUALENV_PATH"
    echo -e "
    # virtualenv settings
    source $VIRTUALENV_PATH/bin/activate
    cd /vagrant
    "  >> $VAGRANT_HOME_PATH/.bashrc

    su -l vagrant -c "$VIRTUALENV_PATH/bin/python -m pip install --upgrade pip"
    su -l vagrant -c "$VIRTUALENV_PATH/bin/python -m pip install -r /vagrant/requirements/dev.txt"
}


function install_postgresql()
{
    PG_VERSION="9.5"
    PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
    PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
    PG_DIR="/var/lib/postgresql/$PG_VERSION/main"

    APP_DB_USER=vagrant
    APP_DB_PASS=dbpass
    APP_DB_NAME="$PRJ_NAME"_db

    apt-get install -y "postgresql-$PG_VERSION" "postgresql-contrib-$PG_VERSION" "postgresql-server-dev-$PG_VERSION"

    # Edit postgresql.conf to change listen address to '*':
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"

    # Append to pg_hba.conf to add password auth:
    echo "host    all             all             all                     md5" >> "$PG_HBA"

    # Restart so that all new config is loaded:
    service postgresql restart

    cat << EOF | su - postgres -c psql
    -- Create the database user:
    CREATE USER $APP_DB_USER
        WITH PASSWORD '$APP_DB_PASS' SUPERUSER CREATEDB;

    -- Create the database:
    CREATE DATABASE $APP_DB_NAME
        WITH OWNER $APP_DB_USER
        TEMPLATE=template0
        ENCODING = 'UTF-8'
        LC_COLLATE = 'en_US.UTF-8'
        LC_CTYPE = 'en_US.UTF-8';
EOF
}


startup
install_python
install_postgresql

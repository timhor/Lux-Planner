from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
stop_information = Table('stop_information', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('place_name', VARCHAR(length=128)),
    Column('expiry', DATETIME),
    Column('cached_data', BLOB),
    Column('data_type', VARCHAR(length=128)),
)

cache_information = Table('cache_information', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('place_name', String(length=128)),
    Column('data_type', String(length=128)),
    Column('cached_data', LargeBinary),
    Column('expiry', DateTime),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['stop_information'].drop()
    post_meta.tables['cache_information'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['stop_information'].create()
    post_meta.tables['cache_information'].drop()
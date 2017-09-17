from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
stop_information = Table('stop_information', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('place_name', VARCHAR(length=128)),
    Column('expiry', DATETIME),
    Column('cached_attraction', BLOB),
    Column('cached_photos', BLOB),
    Column('wiki_blurb', TEXT),
)

stop_information = Table('stop_information', post_meta,
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
    pre_meta.tables['stop_information'].columns['cached_attraction'].drop()
    pre_meta.tables['stop_information'].columns['cached_photos'].drop()
    pre_meta.tables['stop_information'].columns['wiki_blurb'].drop()
    post_meta.tables['stop_information'].columns['cached_data'].create()
    post_meta.tables['stop_information'].columns['data_type'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['stop_information'].columns['cached_attraction'].create()
    pre_meta.tables['stop_information'].columns['cached_photos'].create()
    pre_meta.tables['stop_information'].columns['wiki_blurb'].create()
    post_meta.tables['stop_information'].columns['cached_data'].drop()
    post_meta.tables['stop_information'].columns['data_type'].drop()

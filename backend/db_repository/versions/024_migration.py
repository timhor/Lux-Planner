from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
stop = Table('stop', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('stop_name', VARCHAR(length=128)),
    Column('stop_rating', FLOAT),
    Column('journey_id', INTEGER),
    Column('arrival_date', DATETIME),
    Column('departure_date', DATETIME),
    Column('notes', TEXT),
)

journey = Table('journey', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('cost', FLOAT),
    Column('end_date', DATETIME),
    Column('start_date', DATETIME),
    Column('user_id', INTEGER),
    Column('journey_name', VARCHAR(length=128)),
    Column('start_location', VARCHAR(length=128)),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['stop'].columns['stop_rating'].drop()
    pre_meta.tables['journey'].columns['cost'].drop()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['stop'].columns['stop_rating'].create()
    pre_meta.tables['journey'].columns['cost'].create()

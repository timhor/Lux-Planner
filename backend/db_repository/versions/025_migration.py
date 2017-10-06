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


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['stop'].columns['stop_rating'].drop()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['stop'].columns['stop_rating'].create()

from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
stop = Table('stop', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('journey_id', Integer),
    Column('stop_name', String(length=128)),
    Column('arrival_date', DateTime),
    Column('departure_date', DateTime),
    Column('stop_rating', Float),
)

journey = Table('journey', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('user_id', Integer),
    Column('journey_name', String(length=128)),
    Column('start_date', DateTime),
    Column('end_date', DateTime),
    Column('cost', Float),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop'].columns['arrival_date'].create()
    post_meta.tables['stop'].columns['departure_date'].create()
    post_meta.tables['journey'].columns['journey_name'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop'].columns['arrival_date'].drop()
    post_meta.tables['stop'].columns['departure_date'].drop()
    post_meta.tables['journey'].columns['journey_name'].drop()

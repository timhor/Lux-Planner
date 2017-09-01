from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
stop = Table('stop', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('journey_id', Integer),
    Column('stop_name', String(length=128)),
    Column('stop_rating', Float),
)

itinerary = Table('itinerary', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('stop_id', Integer),
    Column('day_of_event', DateTime),
)

journey = Table('journey', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('user_id', Integer),
    Column('start_date', DateTime),
    Column('end_date', DateTime),
    Column('cost', Float),
)

place = Table('place', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('itinerary_id', Integer),
    Column('place_name', String(length=128)),
    Column('place_rating', Float),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop'].columns['journey_id'].create()
    post_meta.tables['itinerary'].columns['stop_id'].create()
    post_meta.tables['journey'].columns['user_id'].create()
    post_meta.tables['place'].columns['itinerary_id'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop'].columns['journey_id'].drop()
    post_meta.tables['itinerary'].columns['stop_id'].drop()
    post_meta.tables['journey'].columns['user_id'].drop()
    post_meta.tables['place'].columns['itinerary_id'].drop()

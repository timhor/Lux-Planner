from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
itinerary = Table('itinerary', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('day_of_event', DATETIME),
    Column('stop_id', INTEGER),
)

place = Table('place', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('place_name', VARCHAR(length=128)),
    Column('place_rating', FLOAT),
    Column('itinerary_id', INTEGER),
)

stop = Table('stop', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('journey_id', Integer),
    Column('stop_name', String(length=128)),
    Column('arrival_date', DateTime),
    Column('departure_date', DateTime),
    Column('notes', Text),
    Column('itinerary', LargeBinary),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['itinerary'].drop()
    pre_meta.tables['place'].drop()
    post_meta.tables['stop'].columns['itinerary'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['itinerary'].create()
    pre_meta.tables['place'].create()
    post_meta.tables['stop'].columns['itinerary'].drop()

from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
itinerary = Table('itinerary', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('day_of_event', DateTime),
)

place = Table('place', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('place_name', String(length=128)),
    Column('place_rating', Float),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['itinerary'].columns['day_of_event'].create()
    post_meta.tables['place'].columns['place_name'].create()
    post_meta.tables['place'].columns['place_rating'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['itinerary'].columns['day_of_event'].drop()
    post_meta.tables['place'].columns['place_name'].drop()
    post_meta.tables['place'].columns['place_rating'].drop()

from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
itinerary = Table('itinerary', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
)

place = Table('place', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
)

journey = Table('journey', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('user_id', INTEGER),
    Column('start_date', DATETIME),
    Column('end_date', DATETIME),
    Column('cost', DATETIME),
)

user = Table('user', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('name', VARCHAR(length=128)),
    Column('age', INTEGER),
    Column('email', VARCHAR(length=128)),
    Column('username', VARCHAR(length=64)),
    Column('password', VARCHAR(length=64)),
)

stop = Table('stop', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('journey_id', INTEGER),
    Column('stop_name', VARCHAR(length=128)),
    Column('rating', FLOAT),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['itinerary'].create()
    post_meta.tables['place'].create()
    pre_meta.tables['journey'].columns['cost'].drop()
    pre_meta.tables['journey'].columns['end_date'].drop()
    pre_meta.tables['journey'].columns['start_date'].drop()
    pre_meta.tables['journey'].columns['user_id'].drop()
    pre_meta.tables['user'].columns['age'].drop()
    pre_meta.tables['user'].columns['email'].drop()
    pre_meta.tables['user'].columns['name'].drop()
    pre_meta.tables['user'].columns['password'].drop()
    pre_meta.tables['user'].columns['username'].drop()
    pre_meta.tables['stop'].columns['journey_id'].drop()
    pre_meta.tables['stop'].columns['rating'].drop()
    pre_meta.tables['stop'].columns['stop_name'].drop()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['itinerary'].drop()
    post_meta.tables['place'].drop()
    pre_meta.tables['journey'].columns['cost'].create()
    pre_meta.tables['journey'].columns['end_date'].create()
    pre_meta.tables['journey'].columns['start_date'].create()
    pre_meta.tables['journey'].columns['user_id'].create()
    pre_meta.tables['user'].columns['age'].create()
    pre_meta.tables['user'].columns['email'].create()
    pre_meta.tables['user'].columns['name'].create()
    pre_meta.tables['user'].columns['password'].create()
    pre_meta.tables['user'].columns['username'].create()
    pre_meta.tables['stop'].columns['journey_id'].create()
    pre_meta.tables['stop'].columns['rating'].create()
    pre_meta.tables['stop'].columns['stop_name'].create()

from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
location = Table('location', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('place_name', VARCHAR(length=128)),
    Column('rating', FLOAT),
    Column('popular_points', VARCHAR),
)

journey = Table('journey', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('user_id', Integer),
    Column('start_date', DateTime),
    Column('end_date', DateTime),
    Column('cost', DateTime),
)

stop = Table('stop', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('journey_id', Integer),
    Column('stop_name', String(length=128)),
    Column('rating', Float),
)

user = Table('user', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('name', VARCHAR(length=128)),
    Column('age', INTEGER),
    Column('email', VARCHAR(length=128)),
    Column('fav_fish', VARCHAR(length=64)),
    Column('username', VARCHAR(length=64)),
    Column('password', VARCHAR(length=64)),
    Column('trips', VARCHAR(length=128)),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['location'].drop()
    post_meta.tables['journey'].create()
    post_meta.tables['stop'].create()
    pre_meta.tables['user'].columns['fav_fish'].drop()
    pre_meta.tables['user'].columns['trips'].drop()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['location'].create()
    post_meta.tables['journey'].drop()
    post_meta.tables['stop'].drop()
    pre_meta.tables['user'].columns['fav_fish'].create()
    pre_meta.tables['user'].columns['trips'].create()

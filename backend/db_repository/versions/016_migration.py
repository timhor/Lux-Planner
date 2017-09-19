from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
user = Table('user', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('age', INTEGER),
    Column('email', VARCHAR(length=128)),
    Column('name', VARCHAR(length=128)),
    Column('password', VARCHAR(length=64)),
    Column('username', VARCHAR(length=64)),
    Column('active_journey_index', INTEGER),
)

user = Table('user', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('first_name', String(length=128)),
    Column('last_name', String(length=128)),
    Column('gender', String(length=64)),
    Column('age', Integer),
    Column('email', String(length=128)),
    Column('username', String(length=64)),
    Column('password', String(length=64)),
    Column('active_journey_index', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['user'].columns['name'].drop()
    post_meta.tables['user'].columns['first_name'].create()
    post_meta.tables['user'].columns['gender'].create()
    post_meta.tables['user'].columns['last_name'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['user'].columns['name'].create()
    post_meta.tables['user'].columns['first_name'].drop()
    post_meta.tables['user'].columns['gender'].drop()
    post_meta.tables['user'].columns['last_name'].drop()

from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
user = Table('user', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('age', INTEGER),
    Column('email', VARCHAR(length=128)),
    Column('password', VARCHAR(length=64)),
    Column('username', VARCHAR(length=64)),
    Column('active_journey_index', INTEGER),
    Column('first_name', VARCHAR(length=128)),
    Column('gender', VARCHAR(length=64)),
    Column('last_name', VARCHAR(length=128)),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['user'].columns['age'].drop()
    pre_meta.tables['user'].columns['gender'].drop()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['user'].columns['age'].create()
    pre_meta.tables['user'].columns['gender'].create()

from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
user = Table('user', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('name', String(length=128)),
    Column('age', Integer),
    Column('email', String(length=128)),
    Column('username', String(length=64)),
    Column('password', String(length=64)),
    Column('active_journey_index', Integer),
)

journey = Table('journey', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('cost', FLOAT),
    Column('end_date', DATETIME),
    Column('start_date', DATETIME),
    Column('user_id', INTEGER),
    Column('active_journey_index', INTEGER),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['user'].columns['active_journey_index'].create()
    pre_meta.tables['journey'].columns['active_journey_index'].drop()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['user'].columns['active_journey_index'].drop()
    pre_meta.tables['journey'].columns['active_journey_index'].create()

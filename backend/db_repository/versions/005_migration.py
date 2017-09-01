from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
journey = Table('journey', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('start_date', DateTime),
    Column('end_date', DateTime),
    Column('cost', Float),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['journey'].columns['cost'].create()
    post_meta.tables['journey'].columns['end_date'].create()
    post_meta.tables['journey'].columns['start_date'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['journey'].columns['cost'].drop()
    post_meta.tables['journey'].columns['end_date'].drop()
    post_meta.tables['journey'].columns['start_date'].drop()

from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
stop = Table('stop', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('stop_name', String(length=128)),
    Column('stop_rating', Float),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop'].columns['stop_name'].create()
    post_meta.tables['stop'].columns['stop_rating'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop'].columns['stop_name'].drop()
    post_meta.tables['stop'].columns['stop_rating'].drop()

from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
stop_information = Table('stop_information', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('place_name', String(length=128)),
    Column('wiki_blurb', Text),
    Column('cached_photos', LargeBinary),
    Column('cached_attraction', LargeBinary),
    Column('expiry', DateTime),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop_information'].columns['cached_photos'].create()
    post_meta.tables['stop_information'].columns['wiki_blurb'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop_information'].columns['cached_photos'].drop()
    post_meta.tables['stop_information'].columns['wiki_blurb'].drop()

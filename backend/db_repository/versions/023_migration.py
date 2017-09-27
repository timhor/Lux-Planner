from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
stop = Table('stop', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('journey_id', Integer),
    Column('stop_name', String(length=128)),
    Column('arrival_date', DateTime),
    Column('departure_date', DateTime),
    Column('stop_rating', Float),
    Column('notes', Text),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop'].columns['notes'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['stop'].columns['notes'].drop()

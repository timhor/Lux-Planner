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
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['user'].columns['age'].create()
    post_meta.tables['user'].columns['email'].create()
    post_meta.tables['user'].columns['name'].create()
    post_meta.tables['user'].columns['password'].create()
    post_meta.tables['user'].columns['username'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['user'].columns['age'].drop()
    post_meta.tables['user'].columns['email'].drop()
    post_meta.tables['user'].columns['name'].drop()
    post_meta.tables['user'].columns['password'].drop()
    post_meta.tables['user'].columns['username'].drop()

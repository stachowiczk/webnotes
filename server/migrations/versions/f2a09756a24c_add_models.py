"""add models

Revision ID: f2a09756a24c
Revises: 21a387d587a0
Create Date: 2023-02-19 13:15:26.409522

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f2a09756a24c'
down_revision = '21a387d587a0'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('users',
        sa.Column('id', sa.INTEGER(), nullable=False),
        sa.Column('username', sa.VARCHAR(length=80), nullable=False),
        sa.Column('password', sa.VARCHAR(length=128), nullable=False),
        sa.Column('created_at', sa.DATETIME(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username')
        )
    op.create_table('notes',
        sa.Column('id', sa.INTEGER(), nullable=False),
        sa.Column('title', sa.VARCHAR(length=255), nullable=False),
        sa.Column('content', sa.TEXT(), nullable=False),
        sa.Column('created_at', sa.DATETIME(), nullable=True),
        sa.Column('user_id', sa.INTEGER(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
        )

def downgrade():
    op.drop_table('notes')
    op.drop_table('users')
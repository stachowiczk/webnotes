"""test folder

Revision ID: 08abf17460f7
Revises: f2a09756a24c
Create Date: 2023-02-27 14:42:55.604277

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "08abf17460f7"
down_revision = "f2a09756a24c"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("notes", sa.Column("folder_id", sa.INTEGER(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("folders")
    op.drop_column("notes", "folder_id")
    # ### end Alembic commands ###

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url="postgresql://postgres:AliArham1321@localhost:5432/shopadmindb"
engine = create_engine(db_url)
session =sessionmaker(autocommit=False, autoflush=False, bind=engine)
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

db_url=DATABASE_URL
engine = create_engine(db_url)
session =sessionmaker(autocommit=False, autoflush=False, bind=engine)
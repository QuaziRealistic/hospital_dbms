# databse tinker file

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv() # connecting to .env file

DATABASE_URL = os.getenv("DATABASE_URL") # get database frpm .env

engine = create_engine(DATABASE_URL) # sqlalchemy library engine

# sessions generator
sesslions = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base() # models basic class
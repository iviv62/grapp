from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


class Command(Base):
    __tablename__ = "commands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    terminal_command = Column(String)
    filename = Column(String, nullable=True) # Making filename nullable for now

    parameters = relationship("CommandParameter", back_populates="command")


class CommandParameter(Base):
    __tablename__ = "command_parameters"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, nullable=True)
    value = Column(String, nullable=True)
    command_id = Column(Integer, ForeignKey("commands.id"))

    command = relationship("Command", back_populates="parameters")

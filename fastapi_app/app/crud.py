from sqlalchemy.orm import Session
from . import models, schemas

def get_command_by_name(db: Session, name: str):
    return db.query(models.Command).filter(models.Command.name == name).first()

def get_commands(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Command).offset(skip).limit(limit).all()

def create_command(db: Session, command: schemas.CommandCreate):
    db_command = models.Command(
        name=command.name,
        terminal_command=command.terminal_command,
        filename=command.filename
    )
    db.add(db_command)
    db.commit()
    db.refresh(db_command)
    for param in command.parameters:
        db_param = models.CommandParameter(key=param.key, value=param.value, command_id=db_command.id)
        db.add(db_param)
    db.commit()
    db.refresh(db_command)
    return db_command

def get_command_parameters(db: Session, command_id: int):
    return db.query(models.CommandParameter).filter(models.CommandParameter.command_id == command_id).all()

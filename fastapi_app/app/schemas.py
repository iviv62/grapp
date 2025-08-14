from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CommandParameterBase(BaseModel):
    key: Optional[str] = None
    value: Optional[str] = None

class CommandParameterCreate(CommandParameterBase):
    pass

class CommandParameter(CommandParameterBase):
    id: int
    command_id: int

    class Config:
        orm_mode = True

class CommandBase(BaseModel):
    name: str
    terminal_command: str
    filename: Optional[str] = None

class CommandCreate(CommandBase):
    parameters: List[CommandParameterCreate] = []

class Command(CommandBase):
    id: int
    parameters: List[CommandParameter] = []

    class Config:
        orm_mode = True

class Node(BaseModel):
    id: Any
    # Allow any other fields
    class Config:
        extra = "allow"

class Link(BaseModel):
    source: Any
    target: Any
    # Allow any other fields
    class Config:
        extra = "allow"

class GraphData(BaseModel):
    nodes: List[Node]
    links: List[Link]
    # Allow other fields for multigraph, etc.
    class Config:
        extra = "allow"

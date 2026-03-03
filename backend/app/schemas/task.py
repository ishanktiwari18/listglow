from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.task import TaskStatus, TaskPriority


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.TODO
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None


class TaskResponse(TaskBase):
    id: int
    is_completed: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    total: int
    page: int
    page_size: int

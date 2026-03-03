from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


def get_task_by_id(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def get_tasks(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    owner_id: Optional[int] = None,
    status: Optional[TaskStatus] = None
) -> List[Task]:
    query = db.query(Task)
    
    if owner_id:
        query = query.filter(Task.owner_id == owner_id)
    
    if status:
        query = query.filter(Task.status == status)
    
    return query.offset(skip).limit(limit).all()


def get_tasks_count(
    db: Session,
    owner_id: Optional[int] = None,
    status: Optional[TaskStatus] = None
) -> int:
    query = db.query(Task)
    
    if owner_id:
        query = query.filter(Task.owner_id == owner_id)
    
    if status:
        query = query.filter(Task.status == status)
    
    return query.count()


def create_task(db: Session, task: TaskCreate, owner_id: int) -> Task:
    db_task = Task(
        **task.model_dump(),
        owner_id=owner_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task_update: TaskUpdate) -> Optional[Task]:
    db_task = get_task_by_id(db, task_id)
    if not db_task:
        return None
    
    update_data = task_update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    if task_update.status == TaskStatus.COMPLETED:
        db_task.is_completed = True
    elif task_update.status in [TaskStatus.TODO, TaskStatus.IN_PROGRESS]:
        db_task.is_completed = False
    
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int) -> bool:

    db_task = get_task_by_id(db, task_id)
    if not db_task:
        return False
    
    db.delete(db_task)
    db.commit()
    return True

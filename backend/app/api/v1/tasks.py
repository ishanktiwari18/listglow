from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from app.crud import task as task_crud
from app.models.user import User, UserRole
from app.models.task import TaskStatus
from app.api.dependencies import get_current_active_user

router = APIRouter()


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task: TaskCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return task_crud.create_task(db=db, task=task, owner_id=current_user.id)


@router.get("/", response_model=TaskListResponse)
async def read_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[TaskStatus] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    owner_id = None if current_user.role == UserRole.ADMIN else current_user.id
    
    tasks = task_crud.get_tasks(
        db,
        skip=skip,
        limit=limit,
        owner_id=owner_id,
        status=status
    )
    
    total = task_crud.get_tasks_count(
        db,
        owner_id=owner_id,
        status=status
    )
    
    return {
        "tasks": tasks,
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit
    }


@router.get("/{task_id}", response_model=TaskResponse)
async def read_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = task_crud.get_task_by_id(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if current_user.role != UserRole.ADMIN and task.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this task"
        )
    
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = task_crud.get_task_by_id(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if current_user.role != UserRole.ADMIN and task.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this task"
        )
    
    updated_task = task_crud.update_task(db, task_id=task_id, task_update=task_update)
    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    task = task_crud.get_task_by_id(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if current_user.role != UserRole.ADMIN and task.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this task"
        )
    
    task_crud.delete_task(db, task_id=task_id)
    return None

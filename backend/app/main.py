from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import api_router
from app.middleware.logging import LoggingMiddleware
from app.middleware.error_handler import (
    validation_exception_handler,
    sqlalchemy_exception_handler,
    general_exception_handler
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="""Task Management API with JWT Authentication & Role-Based Access Control""",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(LoggingMiddleware)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Task Management API",
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION
    }

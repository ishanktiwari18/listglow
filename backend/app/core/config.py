from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/taskdb"
    
    # JWT
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    # Application
    APP_NAME: str = "Task Management API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()

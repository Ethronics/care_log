from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/care_log"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-chars-please"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Optional: for intelligent care-log summarization (POST /api/summarize). Free tier at https://ai.google.dev/
    GEMINI_API_KEY: str | None = None

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
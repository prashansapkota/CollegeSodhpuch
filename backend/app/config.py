from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CollegeSodhpuch API"
    debug: bool = False

    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_db: str = "collegesodhpuch"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    groq_api_key: str = ""

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    allowed_origins: str = "http://localhost:3000"

    database_url_override: str = ""
    database_url: str = Field(default="", alias="DATABASE_URL")

    @property
    def sqlalchemy_database_url(self) -> str:
        # Prefer explicit override, then standard provider DATABASE_URL.
        raw_url = self.database_url_override or self.database_url
        if raw_url:
            # Providers often expose postgresql://, but asyncpg needs postgresql+asyncpg://
            if raw_url.startswith("postgresql://"):
                return raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return raw_url
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()

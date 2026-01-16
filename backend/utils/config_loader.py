"""Configuration loader with environment variable support"""
import os
import json
from typing import Dict, Any
from pathlib import Path
from dotenv import load_dotenv


class ConfigLoader:
    """Load configuration from JSON with environment variable substitution"""

    def __init__(self, config_path: str = None, env_path: str = None):
        # Load environment variables
        if env_path:
            load_dotenv(env_path)
        else:
            load_dotenv()

        self.config_path = config_path or self._find_config()
        self.config = self._load_config()

    def _find_config(self) -> str:
        """Find config file in default locations"""
        possible_paths = [
            Path(__file__).parent.parent / "config" / "config.json",
            Path(__file__).parent.parent / "config.json",
            Path.cwd() / "config.json"
        ]

        for path in possible_paths:
            if path.exists():
                return str(path)

        raise FileNotFoundError("No config.json found. Please create one from config.example.json")

    def _load_config(self) -> Dict[str, Any]:
        """Load configuration file and substitute environment variables"""
        with open(self.config_path, 'r') as f:
            config = json.load(f)

        return self._substitute_env_vars(config)

    def _substitute_env_vars(self, obj: Any) -> Any:
        """Recursively substitute environment variables in config"""
        if isinstance(obj, dict):
            return {k: self._substitute_env_vars(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._substitute_env_vars(item) for item in obj]
        elif isinstance(obj, str) and obj.startswith("${") and obj.endswith("}"):
            env_var = obj[2:-1]
            value = os.getenv(env_var)
            if value is None:
                print(f"Warning: Environment variable {env_var} not set")
                return obj
            return value
        return obj

    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value by key"""
        return self.config.get(key, default)

    def __getitem__(self, key: str) -> Any:
        """Allow dict-like access"""
        return self.config[key]

    def __contains__(self, key: str) -> bool:
        """Check if key exists"""
        return key in self.config


def load_config(config_path: str = None) -> ConfigLoader:
    """Convenience function to load configuration"""
    return ConfigLoader(config_path)

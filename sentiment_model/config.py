"""
Configuration dataclass for training and inference.
"""
from dataclasses import dataclass
import torch

@dataclass
class Config:
    # Model and tokenizer
    model_name: str = "distilbert-base-uncased"
    max_length: int = 256
    
    # Training hyperparameters
    batch_size: int = 16
    epochs: int = 3
    learning_rate: float = 2e-5
    warmup_ratio: float = 0.1
    weight_decay: float = 0.01
    
    # Paths
    data_path: str = "./data"
    output_dir: str = "./models"
    logs_dir: str = "./logs"
    
    # Hardware
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    
    # Reproducibility
    seed: int = 42
    
    # Early stopping
    patience: int = 2
    
    # Mixed precision
    use_amp: bool = True if torch.cuda.is_available() else False

config = Config()

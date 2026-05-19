"""
Transformer-based sentiment classifier.
"""
import torch
import torch.nn as nn
from transformers import AutoModel, AutoConfig
from config import config

class SentimentClassifier(nn.Module):
    """BERT/DistilBERT classifier with a dropout and linear head."""
    def __init__(self, num_labels: int = 2):
        super().__init__()
        self.num_labels = num_labels
        self.config = AutoConfig.from_pretrained(config.model_name)
        self.config.num_labels = num_labels
        self.transformer = AutoModel.from_pretrained(config.model_name, config=self.config)
        self.dropout = nn.Dropout(0.1)
        self.classifier = nn.Linear(self.config.hidden_size, num_labels)

    def forward(
        self,
        input_ids: torch.Tensor,
        attention_mask: torch.Tensor
    ) -> torch.Tensor:
        """Forward pass. Returns logits."""
        outputs = self.transformer(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        # Use pooled output (or mean of last hidden states)
        pooled = outputs.last_hidden_state[:, 0, :]  # [CLS] token
        pooled = self.dropout(pooled)
        logits = self.classifier(pooled)
        return logits

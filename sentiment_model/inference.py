"""
FastAPI inference server for sentiment analysis.
"""
import os
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer
from model import SentimentClassifier
from config import config
from utils import get_device

app = FastAPI(title="Sentiment Analysis API")

# Global model and tokenizer
model = None
tokenizer = None
device = get_device()

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    label: str
    confidence: float

@app.on_event("startup")
def load_model():
    global model, tokenizer
    model_path = os.path.join(config.output_dir, "best_model.pt")
    if not os.path.exists(model_path):
        raise RuntimeError(f"Model not found at {model_path}. Train first.")
    tokenizer = AutoTokenizer.from_pretrained(config.output_dir)
    model = SentimentClassifier(num_labels=2).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    print("Model loaded successfully.")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=422, detail="Empty text provided")
    
    # Tokenize
    encoding = tokenizer(
        request.text,
        truncation=True,
        padding='max_length',
        max_length=config.max_length,
        return_tensors='pt'
    )
    input_ids = encoding['input_ids'].to(device)
    attention_mask = encoding['attention_mask'].to(device)
    
    with torch.no_grad():
        logits = model(input_ids, attention_mask)
        probs = torch.softmax(logits, dim=1).cpu().numpy()[0]
        pred_class = int(torch.argmax(logits, dim=1).cpu().item())
    
    label = "POSITIVE" if pred_class == 1 else "NEGATIVE"
    confidence = float(probs[pred_class])
    
    return PredictionResponse(label=label, confidence=confidence)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

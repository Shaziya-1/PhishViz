import sys
import os
import numpy as np

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.ml_logic.nn_models import ANNModel, EmailLSTM

def setup_models():
    # Paths
    save_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "ml"))
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    print(f"Initializing baseline models in {save_dir}...")

    # 1. URL ANN
    ann = ANNModel(input_dim=48)
    # Save a baseline model
    ann_path = os.path.join(save_dir, "url_ann_model.h5")
    ann.save(ann_path)
    print(f"Saved ANN to {ann_path}")

    # 2. Email LSTM
    lstm = EmailLSTM()
    lstm_path = os.path.join(save_dir, "email_lstm_model.h5")
    lstm.save(lstm_path)
    print(f"Saved LSTM to {lstm_path}")

if __name__ == "__main__":
    setup_models()

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Embedding, Dropout, GlobalMaxPooling1D
import os
import joblib

class ANNModel:
    """ANN for feature-based URL detection."""
    def __init__(self, input_dim=48):
        self.model = Sequential([
            Dense(64, activation='relu', input_dim=input_dim),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(16, activation='relu'),
            Dense(1, activation='sigmoid')
        ])
        self.model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    def save(self, path):
        self.model.save(path)

    def load(self, path):
        self.model = tf.keras.models.load_model(path)

class EmailLSTM:
    """LSTM for sequence-based Email/Text detection."""
    def __init__(self, max_features=10000, maxlen=300):
        self.model = Sequential([
            Embedding(input_dim=max_features, output_dim=128, input_length=maxlen),
            LSTM(64, return_sequences=True),
            GlobalMaxPooling1D(),
            Dense(32, activation='relu'),
            Dropout(0.2),
            Dense(1, activation='sigmoid')
        ])
        self.model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    def save(self, path):
        self.model.save(path)

    def load(self, path):
        self.model = tf.keras.models.load_model(path)

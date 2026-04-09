import yfinance as yf
import pandas as pd
from src.config import TICKERS, PERIOD, DB_PATH


def extract_ticker(symbol, period):
    print(f"Descargando {symbol}...")
    try:

        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period)
        # agregamos columna para saber a qué acción pertenece cada fila
        df["symbol"] = symbol
        df.index.name = "date"
        df = df.reset_index()  # convierte el indice fecha en columna normal
        return df
    except Exception as e:
        print(f"Error descargando {symbol}: {e}")
        return None


def extract_all():
    frames = []
    for symbol in TICKERS:
        df = extract_ticker(symbol, period=PERIOD)
        if df is not None:
            frames.append(df)
    frames = pd.concat(frames)

    return frames

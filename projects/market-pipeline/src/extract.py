# ============================================================
# extract.py — Capa de Extracción (la "E" del ETL)
# ============================================================
# Esta capa tiene UNA sola responsabilidad:
# conectarse a la fuente de datos y traer los datos crudos.
# No transforma nada aquí. Solo extrae y guarda.

import yfinance as yf
import pandas as pd
import os
from src.config import TICKERS, INDICES, PERIOD, DATA_RAW_PATH


def extract_ticker(symbol: str, period: str) -> pd.DataFrame:
    """
    Descarga el historial de precios de un símbolo desde Yahoo Finance.

    Args:
        symbol: El símbolo de la acción, ej: "AAPL"
        period: El período, ej: "6mo"

    Returns:
        DataFrame con columnas: Open, High, Low, Close, Volume
    """
    print(f"  Extrayendo {symbol}...")
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=period)

    # Agregamos el símbolo como columna para identificar la fila
    df["symbol"] = symbol
    df.index.name = "date"
    df = df.reset_index()

    return df


def extract_all(period: str = PERIOD) -> pd.DataFrame:
    """
    Extrae datos de todas las acciones e índices definidos en config.py
    y los une en un solo DataFrame.

    Returns:
        DataFrame con todos los datos crudos combinados
    """
    all_symbols = {**TICKERS, **INDICES}
    frames = []

    print("Iniciando extracción de datos...")
    for symbol in all_symbols:
        df = extract_ticker(symbol, period)
        frames.append(df)

    # Unimos todos los DataFrames en uno solo
    combined = pd.concat(frames, ignore_index=True)
    print(f"Extracción completa: {len(combined)} filas, {combined['symbol'].nunique()} símbolos\n")

    # Guardamos los datos crudos (sin transformar) en CSV
    os.makedirs(DATA_RAW_PATH, exist_ok=True)
    raw_path = os.path.join(DATA_RAW_PATH, "raw_prices.csv")
    combined.to_csv(raw_path, index=False)
    print(f"Datos crudos guardados en: {raw_path}")

    return combined

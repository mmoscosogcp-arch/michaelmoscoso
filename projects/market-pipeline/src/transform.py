# ============================================================
# transform.py — Capa de Transformación (la "T" del ETL)
# ============================================================
# Recibe los datos crudos y los enriquece:
# limpieza, nuevas columnas calculadas, formato correcto.
# El output de esta capa ya está listo para analizar.

import pandas as pd
import os
from src.config import DATA_PROCESSED_PATH


def transform(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforma el DataFrame crudo aplicando:
    1. Limpieza de columnas innecesarias
    2. Tipos de datos correctos
    3. Cálculo de métricas financieras

    Args:
        df: DataFrame crudo de extract.py

    Returns:
        DataFrame limpio y enriquecido
    """
    print("Iniciando transformación...")

    # 1. Seleccionar solo las columnas que necesitamos
    df = df[["date", "symbol", "Open", "High", "Low", "Close", "Volume"]].copy()

    # 2. Asegurar tipos de datos correctos
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df["Close"] = df["Close"].round(4)
    df["Open"]  = df["Open"].round(4)

    # 3. Ordenar por símbolo y fecha (necesario para los cálculos siguientes)
    df = df.sort_values(["symbol", "date"]).reset_index(drop=True)

    # 4. Calcular retorno diario (cuánto subió o bajó en % ese día)
    # pct_change() calcula la variación porcentual respecto al día anterior
    df["daily_return"] = df.groupby("symbol")["Close"].pct_change().round(6)

    # 5. Promedio móvil de 7 días (suaviza el ruido del precio)
    df["ma_7"] = (
        df.groupby("symbol")["Close"]
        .transform(lambda x: x.rolling(window=7, min_periods=1).mean())
        .round(4)
    )

    # 6. Promedio móvil de 30 días (tendencia más larga)
    df["ma_30"] = (
        df.groupby("symbol")["Close"]
        .transform(lambda x: x.rolling(window=30, min_periods=1).mean())
        .round(4)
    )

    # 7. Volatilidad: desviación estándar de retornos en 7 días
    # Alta volatilidad = precio muy variable = mayor riesgo
    df["volatility_7d"] = (
        df.groupby("symbol")["daily_return"]
        .transform(lambda x: x.rolling(window=7, min_periods=1).std())
        .round(6)
    )

    # 8. Eliminar filas sin retorno (primera fila de cada símbolo)
    df = df.dropna(subset=["daily_return"])

    print(f"Transformación completa: {len(df)} filas")
    print(f"Columnas generadas: {list(df.columns)}\n")

    # Guardar datos procesados
    os.makedirs(DATA_PROCESSED_PATH, exist_ok=True)
    processed_path = os.path.join(DATA_PROCESSED_PATH, "processed_prices.csv")
    df.to_csv(processed_path, index=False)
    print(f"Datos procesados guardados en: {processed_path}")

    return df

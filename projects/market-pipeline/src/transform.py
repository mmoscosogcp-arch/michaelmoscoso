
import pandas as pd


def transform(df: pd.DataFrame):
    df = df[["date", "symbol", "Open", "High", "Low", "Close", "Volume"]].copy()
    df["date"] = pd.to_datetime(df["date"]).dt.date
    df = df.sort_values(["symbol", "date"]).reset_index(drop=True)
    df["daily_return"] = df.groupby("symbol")["Close"].pct_change()
    df["ma_7"] = df.groupby("symbol")["Close"].transform(
        lambda x: x.rolling(7).mean())
    df["ma_30"] = df.groupby("symbol")["Close"].transform(
        lambda x: x.rolling(30).mean())
    df = df.dropna(subset=["daily_return"])
    return df

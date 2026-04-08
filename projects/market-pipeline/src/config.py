# ============================================================
# config.py — Configuración central del pipeline
# ============================================================
# Aquí centralizamos todo lo que puede cambiar:
# qué acciones bajar, por cuánto tiempo, dónde guardar.
# Así si quieres agregar una acción nueva, solo tocas este archivo.

# Acciones a seguir (símbolo de Yahoo Finance)
TICKERS = {
    "AAPL":  "Apple",
    "MSFT":  "Microsoft",
    "GOOGL": "Alphabet (Google)",
    "AMZN":  "Amazon",
    "META":  "Meta",
}

# Índices del mercado
INDICES = {
    "^GSPC": "S&P 500",
    "^IXIC": "NASDAQ",
}

# Período de datos históricos a descargar
# Opciones: "1mo", "3mo", "6mo", "1y", "2y", "5y"
PERIOD = "6mo"

# Rutas de archivos
DATA_RAW_PATH       = "data/raw"
DATA_PROCESSED_PATH = "data/processed"
DB_PATH             = "data/market_data.db"
REPORT_PATH         = "reports/report.html"

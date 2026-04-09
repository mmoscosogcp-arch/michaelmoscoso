# Pipeline de mercados financiero (YAHOO FINANCE)

En este proyecto realizamos un pequeño pipeline, donde se enfoca en extraer, transformar y cargar la informacion de ciertas acciones para luego cargarlas en DuckDB

## Tecnologias

- Python
- yfinance
- Pandas
- DuckDB

## Arquitectura

Extract -> Transform -> Load

## Como correrlo

```bash
git clone ...
cd market-pipeline
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

## Que hace cada archivo

- src/extract -> Aca se extraer la informacion de yfinance para luego dejar listo el df para la transformacion

- src/transform -> Aca se crea las mayores transformaciones del df, agregar columnas (ma_7, ma_30), para dejar el df listo para cargarlo

- src/load -> En load se ocupa para cargar el df resultante final en una tabla en DuckDB

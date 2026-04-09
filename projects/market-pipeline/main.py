
from src.extract import extract_all
from src.transform import transform
from src.load import load


def run_pipeline():
    raw_data = extract_all()
    clean_data = transform(raw_data)
    load(clean_data)


if __name__ == "__main__":
    run_pipeline()

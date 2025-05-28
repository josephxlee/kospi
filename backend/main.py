from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data.fetcher import get_kospi_data
from analysis.indicators import apply_indicators

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methds=["*"],
    allow_headers=["*"],
)

@app.get("/api/kospi")
def read_kospi():
    df = get_kospi_data()
    df = apply_indicators(df)
    return df.tail(100).to_dict(orient="records")
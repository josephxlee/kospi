from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data.fetcher import get_kospi_data
from analysis.indicators import apply_indicators

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    #allow_origins=["https://kospi-three.vercel.app/"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/kospi")
def read_kospi():
    df_data = get_kospi_data()             # 1. KOSPI 원시 데이터 가져오기
    
    df_data = df_data.fillna(0)
    
    #df = apply_indicators(df)         # 2. 기술적 지표 적용 (예: 이동평균, RSI 등)
    #return df.tail(100).to_dict(...)  # 3. 마지막 100개 데이터만 JSON으로 반환
    

    df_data['날짜'] = df_data['날짜'].astype(str)  # datetime 직렬화
    return df_data.to_dict(orient="records")

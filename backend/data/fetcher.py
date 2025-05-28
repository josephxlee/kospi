import requests
import pandas as pd

def get_kospi_data():
    url = "https://finance.naver.com/sise/sise_index_day.naver?code=KOSPI"
    dfs = pd.read_html(url, encoding='euc-kr')
    df = dfs[1].dropna()
    df.columns = ['date', 'close', 'diff', 'open', 'high', 'low','volume']
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    df[['close', 'open', 'high', 'low']] =  df[['close', 'open', 'high', 'low']].astype(float)
    return df
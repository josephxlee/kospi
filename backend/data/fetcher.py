import requests
import pandas as pd
from io import StringIO
from bs4 import BeautifulSoup
import re
import os



def get_total_pages(code='KOSPI'):
    url = f"https://finance.naver.com/sise/sise_index_day.naver?code={code}&page=1"
    res = requests.get(url)
    res.encoding = 'euc-kr'
    soup = BeautifulSoup(res.text, 'html.parser')

    # 페이지 번호가 있는 a 태그들 가져오기
    page_links = soup.select('table.Nnavi a')

    page_numbers = []
    for link in page_links:
        href = link.get('href', '')
        # fnClickPage('숫자') 패턴에서 숫자 추출
        match = re.search(r"fnClickPage\('(\d+)'\)", href)
        if match:
            page_numbers.append(int(match.group(1)))

    if page_numbers:
        return max(page_numbers)
    else:
        return None


def fetch_kospi_by_date_range(start_date, end_date, max_pages=20, save_csv=False, csv_path="kospi_data.csv"):
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)

    all_data = []

    for page in range(1, max_pages + 1):
        url = f"https://finance.naver.com/sise/sise_index_day.naver?code=KOSPI&page={page}"
        res = requests.get(url)
        res.encoding = 'euc-kr'

        # read_html with StringIO
        tables = pd.read_html(StringIO(res.text))

        df = tables[0]
        
        row_idx = list(range(1,4)) + list(range(8,11))
        row_1to3_8to10 = df.iloc[row_idx]

        all_data.append(row_1to3_8to10)

    # 전체 데이터프레임 병합
    df_all = pd.concat(all_data, ignore_index=True)
    
    # 날짜 컬럼 변환
    df_all["날짜"] = pd.to_datetime(df_all["날짜"], format="%Y.%m.%d", errors="coerce")

    # 날짜 범위 필터링
    df_all = df_all[(df_all["날짜"] >= start_date) & (df_all["날짜"] <= end_date)]

    # 숫자형 컬럼 처리: 날짜 제외한 모든 컬럼을 float로 변환
    for col in df_all.columns:
        if col == "체결가" or col == "거래량(천주)" or col == "거래대금(백만)":
            df_all[col] = pd.to_numeric(df_all[col], errors="coerce")

    # CSV 저장 선택
    if save_csv:
        df_all.to_csv(csv_path, index=False)
        
    return df_all


def fetch_kospi_by_date_range_from_csv(start_date, end_date, csv_path="kospi_data.csv"):
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_date)

    # CSV 파일 존재 확인
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV 파일이 존재하지 않습니다: {csv_path}")

    # CSV 읽기
    df = pd.read_csv(csv_path)

    # 날짜 형식 변환
    df["날짜"] = pd.to_datetime(df["날짜"], errors="coerce")

    # 날짜 필터링
    df_filtered = df[(df["날짜"] >= start_date) & (df["날짜"] <= end_date)]

    # 숫자형 컬럼 정리 (선택적)
    for col in df.columns:
        if col not in ["날짜"]:
            df_filtered[col] = pd.to_numeric(df_filtered[col], errors="coerce")

    return df_filtered

def get_kospi_data():
    
    #df_data = fetch_kospi_by_date_range('1990-01-04', '2025-06-09', max_pages=1527, save_csv=True)
    df_data = fetch_kospi_by_date_range_from_csv('1990-01-04', '2025-05-15', csv_path="kospi_data_20250609.csv")
    
    return df_data
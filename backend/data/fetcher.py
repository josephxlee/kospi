import requests
import pandas as pd
from io import StringIO
from bs4 import BeautifulSoup
import re



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
    
    return df_all


def get_kospi_data():
    
    df_data = fetch_kospi_by_date_range('2025-01-01', '2025-05-15', max_pages=10, save_csv=True)
    
    return df_data
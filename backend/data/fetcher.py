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
        #print(row_1to3_8to10.values)
    
    #    # 열 제목이 행에 끼어있을 경우 제거
    #    table = table[~(table == table.columns).all(axis=1)]
    #    
    #    # 등락률: % 제거, 부호 처리, 실수로 변환
    #    #table['등락률'] = table['등락률'].str.replace('%', '', regex=False).astype(float) / 100
    #    
    #    # 날짜형 변환
    #    #table.loc[:, '날짜'] = pd.to_datetime(table['날짜'], format="%Y.%m.%d", errors='coerce')
    #    
    #    # 날짜 NaT 제거
    #    table = table.dropna(subset=['날짜'])

        all_data.append(row_1to3_8to10)

    # 전체 데이터프레임 병합
    df_all = pd.concat(all_data, ignore_index=True)

    # CSV 저장
    #df.to_csv("kospi_data.csv", index=False, encoding='utf-8-sig')

    #print(df.head())  # 결과 출력
    #print(f"\n행 개수: {len(df)}")
    #print(f"열 개수: {len(df.columns)}")
    
    print(df_all)

    #if all_data:
    #    result = pd.concat(all_data, ignore_index=True)
    #    result = result.sort_values('날짜', ascending=False).reset_index(drop=True)
#
    #    if save_csv:
    #        result.to_csv(csv_path, index=False, encoding='utf-8-sig')
    #        print(f"CSV 파일로 저장 완료: {csv_path}")
#
    #    print(result)
    #    return result
    #else:
    #    print("해당 기간에 데이터가 없습니다.")
    #    return pd.DataFrame(columns=['날짜', '체결가', '전일비', '등락률', '거래량(천주)', '거래대금(백만)'])

def get_kospi_data():
    
    df_range = fetch_kospi_by_date_range('2025-01-01', '2025-05-15', max_pages=365, save_csv=True)
    
    print(df_range)
    
    
    #total_pages = get_total_pages('KOSPI')
    #print("전체 페이지 수:", total_pages)
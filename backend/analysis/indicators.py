import ta

def apply_indicators(df):
    df['sma20'] = ta.trend.sma_indicator(df['close'], window=20)
    df['rsi'] = ta.momentum.RSIIndicator(df['close']).rsi()
    return df
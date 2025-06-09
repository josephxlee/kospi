import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/api/kospi")
      .then((res) => res.json())
      .then((json) => {
        const sorted = json
          .map((item: any) => ({
            날짜: item["날짜"],
            거래량: item["거래량(천주)"],
          }))
          .reverse();
        setData(sorted);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 상단 메뉴바 */}
      <header
        style={{
          padding: "1rem",
          backgroundColor: "#1e293b",
          color: "white",
          fontSize: "1.2rem",
          textAlign: "center",
        }}
      >
        📈 KOSPI 분석 대시보드
      </header>

      {/* 하단: 좌우 분할 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          padding: "1rem",
          background: "#f5f5f5",
        }}
      >
        {/* 왼쪽: 차트 */}
        <div style={{ flex: 1, paddingRight: "1rem" }}>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
            >
              <CartesianGrid stroke="#ccc" />
              <XAxis
                dataKey="날짜"
                interval={Math.floor(data.length / 10)}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="거래량"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>


        {/* 오른쪽: 데이터 리스트
        <div
          style={{
            width: "300px", // 고정 너비
            backgroundColor: "white",
            padding: "1rem",
            overflowY: "auto", // 세로 스크롤
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
          }}
        >
          <h3 style={{ marginBottom: "0.5rem" }}>📋 거래량 데이터</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {data.map((item: any, index: number) => (
              <li
                key={index}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "0.9rem",
                }}
              >
                <strong>{item.날짜}</strong>: {item.거래량.toLocaleString()} 천주
              </li>
            ))}
          </ul>
        </div>
         */}
      </div>
    </div>
  );
}

export default App;

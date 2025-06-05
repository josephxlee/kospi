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
        // 날짜 순서 뒤집기 (오래된 게 앞으로 오게)
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
    <div style={{ width: "100%", height: "500px" }}>
      <h2 style={{ textAlign: "center" }}>KOSPI 거래량 추이</h2>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="날짜" />
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
  );
}

export default App;

import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/api/kospi")
      .then((res) => res.json())
      .then((data) => {
        console.log("백엔드 데이터:", data);
        setData(data); // 배열 전체 저장
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  }, []);

  return (
    <div>
      <h1>KOSPI 데이터</h1>
      <ul>
        {data.map((item: any, index) => (
          <li key={index}>
            {item["날짜"]} - {item["체결가"]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

/*
import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8001/api/kospi")
      //fetch("https://kospi.onrender.com/api/kospi")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // <- 여기서 실제 응답이 확인돼야 함
        setMsg(data[0].종가); // 예: 첫 번째 데이터에서 종가만 표시
    });
  }, []);

  return <h1>{msg}</h1>;
}

export default App;
*/

/*
export default function App() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-blue-600">KOSPI 차트 분석</h1>
      <p className="text-gray-600 mt-2">프론트엔드 초기 설정 완료!</p>
    </div>
  );
}
*/


/*
import { useEffect, useState } from 'react';
import { fetchKospiData } from './api';
import Chart from './components/Chart';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchKospiData().then(setData);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"> KOSPI 분석 차트</h1>
      <Chart data={data} />
    </div>
  );
}

export default App;
*/

/*

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

*/
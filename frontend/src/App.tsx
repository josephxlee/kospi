import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function ChartWithOverlayAndPanZoom() {
  const [fullData, setFullData] = useState<any[]>([]);
  const [visibleData, setVisibleData] = useState<any[]>([]);
  const [range, setRange] = useState({ start: 0, end: 100 });

  const isDragging = useRef(false);
  const lastX = useRef<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8001/api/kospi")
      .then((res) => res.json())
      .then((json) => {
        const sorted = json
          .map((item: any) => ({
            날짜: item["날짜"],
            거래량: item["거래량(천주)"],
            체결가: item["체결가"],
          }))
          .reverse();

        const fullLength = sorted.length;
        const initialStart = Math.max(0, fullLength - 300);
        const initialEnd = fullLength;

        setFullData(sorted);
        setRange({ start: initialStart, end: initialEnd });
        setVisibleData(sorted.slice(initialStart, initialEnd));
      });
  }, []);

  // 줌 (휠)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;

    const { start, end } = range;
    const fullLength = fullData.length;
    const windowSize = end - start;

    const minWindowSize = 30;
    const zoomFactor = Math.max(2, Math.floor(windowSize * 0.1));

    let newStart = start;
    let newEnd = end;

    if (delta > 0 && windowSize > minWindowSize) {
      // Zoom in
      newStart = Math.min(end - minWindowSize, start + zoomFactor);
      newEnd = Math.max(newStart + minWindowSize, end - zoomFactor);
    } else if (delta < 0) {
      // Zoom out
      newStart = Math.max(0, start - zoomFactor);
      newEnd = Math.min(fullLength, end + zoomFactor);
    }

    if (newEnd > newStart && newEnd <= fullLength) {
      setRange({ start: newStart, end: newEnd });
      setVisibleData(fullData.slice(newStart, newEnd));
    }
  };

  // Panning (마우스 드래그)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || lastX.current === null) return;

    const dx = e.clientX - lastX.current;
    const windowSize = range.end - range.start;
    const fullLength = fullData.length;

    const panSpeed = Math.max(1, Math.floor(windowSize * 0.02)); // 줌 상태에 따른 이동 속도
    const shift = Math.round(dx / 10) * panSpeed;

    if (shift !== 0) {
      let newStart = Math.max(0, range.start - shift);
      let newEnd = Math.min(fullLength, range.end - shift);

      if (newEnd > newStart && newEnd <= fullLength) {
        setRange({ start: newStart, end: newEnd });
        setVisibleData(fullData.slice(newStart, newEnd));
        lastX.current = e.clientX;
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    lastX.current = null;
  };

  return (
    <div
      style={{ height: "500px", padding: "1rem", cursor: isDragging.current ? "grabbing" : "grab" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={visibleData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="날짜" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="거래량"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="거래량"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="체결가"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
            name="체결가"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartWithOverlayAndPanZoom;

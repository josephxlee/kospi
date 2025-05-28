import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Chart({ data }: { data: any[] }) {
  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="close" stroke="#8884d8" />
      <Line type="monotone" dataKey="sma20" stroke="#82ca9d" />
      <Line type="monotone" dataKey="rsi" stroke="#f39c12" yAxisId={1} />
    </LineChart>
  );
}

const BASE_URL = "https://kospi.onrender.com";

export async function fetchKospiData() {
  const res = await fetch(`${BASE_URL}/api/kospi`);
  return await res.json();
}

const BASE_URL = "https://kospi.onrender.com";
//const BASE_URL = "http://127.0.0.1:8000";

export async function fetchKospiData() {
  const res = await fetch(`${BASE_URL}/api/kospi`);
  return await res.json();
}



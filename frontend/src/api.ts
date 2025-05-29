const BASE_URL = "https://kospi.onrender.com";

export async function fetchKospiData() {
  const res = await fetch(`${BASE_URL}/api/kospi`);
  return await res.json();
}

/*
export const getKospi = async () => {
  const res = await fetch("http://localhost:8000/api/kospi");
  return res.json();
};
*/

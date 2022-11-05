export const fetcher = async (key: string, init?: RequestInit) => {
  const res = await fetch(key, init);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

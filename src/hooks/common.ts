export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Network response was not ok: ${response.status} ${response.statusText}`
    );
  }

  const data: T = await response.json();
  return data;
}

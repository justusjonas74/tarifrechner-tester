export async function api<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    console.log(response.status);
    console.log(await response.json());
    throw new Error(response.statusText);
  }
  return await (response.json() as Promise<T>);
}

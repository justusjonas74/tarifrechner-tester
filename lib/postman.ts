export function optimizeJSONForPostman(json: string): string {
  const regex2 = /\d{4}-\d{2}-\d{2}/gi;
  return json.replaceAll(regex2, "{{testDatum}}");
}

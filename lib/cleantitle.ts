export function cleanTitle(input: string): string {
  const cleaned = input.replace(/[-–—_]+/g, " ");

  return cleaned.replace(/\s+/g, " ").trim();
}

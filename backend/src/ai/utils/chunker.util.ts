// Splits text into overlapping chunks of roughly `chunkSize` characters.
// Overlap helps preserve context across chunk boundaries so we don't cut a sentence's
// meaning in half right at a chunk edge.
export function chunkText(text: string, chunkSize = 800, overlap = 100): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    start += chunkSize - overlap;
  }

  return chunks.filter((c) => c.length > 0);
}
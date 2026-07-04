export interface EmbeddedChunk {
  text: string;
  embedding: number[];
}

export function chunkText(text: string, maxTokens = 250): string[] {
  // Approximate: 1 token ≈ 4 chars
  const chunkSize = maxTokens * 4;
  const overlap = 50 * 4;
  const chunks: string[] = [];

  // Split on paragraph boundaries first
  const paragraphs = text.split(/\n{2,}/);
  let current = "";

  for (const para of paragraphs) {
    if ((current + para).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      // Keep overlap
      const words = current.split(" ");
      current = words.slice(-Math.floor(overlap / 5)).join(" ") + "\n\n" + para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.filter(c => c.length > 50);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function retrieveTopK(
  queryEmbedding: number[],
  store: EmbeddedChunk[],
  k = 3
): string[] {
  const scored = store.map(chunk => ({
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map(s => s.text);
}

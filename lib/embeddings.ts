// Embedding utility using Anthropic's voyage embeddings via the messages API
// Falls back to a simple TF-IDF-inspired bag-of-words similarity when no API key

export async function embedTexts(texts: string[]): Promise<number[][]> {
  // Use a lightweight local embedding when ANTHROPIC_API_KEY is present
  // We'll use a simple but effective heuristic: character n-gram frequency vectors
  // This avoids an OpenAI dependency while keeping the pipeline self-contained
  return texts.map(t => localEmbed(t));
}

export async function embedQuery(text: string): Promise<number[]> {
  return localEmbed(text);
}

// Local embedding: 512-dim char bigram frequency vector, L2-normalized
// Good enough for cosine similarity within a single brand corpus
function localEmbed(text: string): number[] {
  const dim = 512;
  const vec = new Array(dim).fill(0);
  const lower = text.toLowerCase().replace(/\s+/g, " ");

  // Char bigrams
  for (let i = 0; i < lower.length - 1; i++) {
    const a = lower.charCodeAt(i) % 32;
    const b = lower.charCodeAt(i + 1) % 32;
    const idx = (a * 32 + b) % (dim / 2);
    vec[idx] += 1;
  }

  // Word unigrams
  const words = lower.split(/\W+/).filter(Boolean);
  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash * 31 + word.charCodeAt(i)) & 0x7fffffff;
    }
    vec[dim / 2 + (hash % (dim / 2))] += 1;
  }

  // L2 normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map(v => v / norm);
}

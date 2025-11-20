import { getEmbedding } from './llm';

interface DocumentChunk {
    id: string;
    text: string;
    embedding: number[];
}

// In-memory store
let vectorStore: DocumentChunk[] = [];

export const clearVectorStore = () => {
    vectorStore = [];
};

export const addDocument = async (text: string) => {
    // Simple chunking by paragraphs or fixed size
    const chunks = text.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 50);

    for (const [index, chunk] of chunks.entries()) {
        const embedding = await getEmbedding(chunk);
        vectorStore.push({
            id: `chunk-${index}`,
            text: chunk,
            embedding
        });
    }
    console.log(`Added ${chunks.length} chunks to vector store.`);
};

const cosineSimilarity = (vecA: number[], vecB: number[]) => {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magA * magB);
};

export const retrieveContext = async (query: string, topK: number = 3): Promise<string> => {
    const queryEmbedding = await getEmbedding(query);

    const scoredChunks = vectorStore.map(chunk => ({
        chunk,
        score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    scoredChunks.sort((a, b) => b.score - a.score);

    const topChunks = scoredChunks.slice(0, topK).map(item => item.chunk.text);
    return topChunks.join("\n\n");
};

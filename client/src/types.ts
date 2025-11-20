export interface AnalysisResult {
    matchScore: number;
    strengths: string[];
    gaps: string[];
    summary: string;
}

export interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
}

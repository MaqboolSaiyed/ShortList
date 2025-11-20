import { useState } from 'react';
import UploadSection from './components/UploadSection';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import Background3D from './components/Background3D';
import type { AnalysisResult } from './types';

function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }),
      });

      if (!response.ok) throw new Error('Chat failed');

      const data = await response.json();
      return data.answer;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen relative">
      <Background3D />

      <div className="p-6 md:p-12 max-w-7xl mx-auto">
        {!analysisResult ? (
          <div className="flex items-center justify-center min-h-[80vh]">
            <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-12 pb-12 animate-fade-in">
            <header className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                Resume <span className="text-accent-primary">Screener</span>
              </h1>
              <button
                onClick={() => setAnalysisResult(null)}
                className="text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                Start New Analysis
              </button>
            </header>

            <Dashboard result={analysisResult} />
            <ChatInterface onSendMessage={handleSendMessage} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

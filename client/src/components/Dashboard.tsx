import React from 'react';
import type { AnalysisResult } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface DashboardProps {
    result: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ result }) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Score Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-8">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * result.matchScore) / 100}
                                className={`${getScoreColor(result.matchScore)} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className={`text-4xl font-bold ${getScoreColor(result.matchScore)}`}>
                                {result.matchScore}%
                            </span>
                            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide mt-1">Match</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-3 text-text-primary">Analysis Result</h2>
                        <p className="text-text-secondary text-lg leading-relaxed max-w-xl">{result.summary}</p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Strengths */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-green-100 rounded-2xl">
                            <CheckCircle2 className="text-green-600 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary">Key Strengths</h3>
                    </div>
                    <ul className="space-y-4">
                        {result.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-4 text-text-secondary group">
                                <span className="w-2 h-2 rounded-full bg-green-500 mt-2.5 group-hover:scale-150 transition-transform" />
                                <span className="text-lg">{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gaps */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-red-100 rounded-2xl">
                            <XCircle className="text-red-600 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary">Missing Skills</h3>
                    </div>
                    <ul className="space-y-4">
                        {result.gaps.map((gap, index) => (
                            <li key={index} className="flex items-start gap-4 text-text-secondary group">
                                <span className="w-2 h-2 rounded-full bg-red-500 mt-2.5 group-hover:scale-150 transition-transform" />
                                <span className="text-lg">{gap}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

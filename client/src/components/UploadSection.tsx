import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';

interface UploadSectionProps {
    onAnalyze: (file: File, jobDescription: string) => Promise<void>;
    isLoading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isLoading }) => {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (file && jobDescription) {
            onAnalyze(file, jobDescription);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold tracking-tighter text-text-primary">
                    Job<span className="text-accent-primary">Talk</span>
                </h1>
                <p className="text-text-secondary text-xl max-w-2xl mx-auto font-light">
                    Intelligent resume screening powered by Groq AI.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* File Upload */}
                <div
                    className={`bg-white p-8 rounded-3xl shadow-sm border-2 transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] ${isDragging
                            ? 'border-accent-primary bg-blue-50/50 scale-[1.02]'
                            : 'border-transparent hover:border-gray-200 hover:shadow-md'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="resume-upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center cursor-pointer w-full h-full justify-center group"
                    >
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors ${file ? 'bg-blue-100 text-accent-primary' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-accent-primary'
                            }`}>
                            {file ? <FileText className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                        </div>
                        <p className="text-xl font-semibold mb-2 text-text-primary">
                            {file ? file.name : "Upload Resume"}
                        </p>
                        <p className="text-sm text-text-secondary">
                            {file ? "Click to replace" : "PDF files only"}
                        </p>
                    </label>
                </div>

                {/* Job Description */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col">
                    <label className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider">
                        Job Description
                    </label>
                    <textarea
                        className="flex-1 bg-gray-50 border-none rounded-xl p-6 text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:bg-white transition-all resize-none text-lg leading-relaxed"
                        placeholder="Paste the job requirements here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={handleSubmit}
                    disabled={!file || !jobDescription || isLoading}
                    className="btn-primary text-lg px-10 py-4 flex items-center gap-3 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" /> Analyzing...
                        </>
                    ) : (
                        <>
                            Start Analysis <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadSection;

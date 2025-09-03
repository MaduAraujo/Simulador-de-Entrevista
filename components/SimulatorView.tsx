import React, { useState, useCallback, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateQuestion, evaluateAnswer } from '../services/geminiService';
import Card from './Card';
import TextAreaInput from './TextAreaInput';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import { HistoryItem } from '../hooks/useHistory';
import { LightBulbIcon, StopIcon, TrashIcon, MessageCircleIcon } from './Icons';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

declare const mammoth: any;
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;


interface SimulatorViewProps {
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const SimulatorView: React.FC<SimulatorViewProps> = ({ addHistoryItem }) => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resume, setResume] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any | null>(null);


  const handleStartRecording = async () => {
    setError(null);
    setAnswer('');
    try {
      if (!SpeechRecognition) {
        setError("Seu navegador não suporta a transcrição de áudio. Tente usar o Chrome ou Edge.");
        return;
      }

      // Start Speech Recognition
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = 'pt-BR';

      speechRecognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript);
      };

      speechRecognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setError(`Erro na transcrição: ${event.error}`);
      };
      
      speechRecognitionRef.current.start();

      // Start Media Recorder
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
        if (isRecording) {
            handleStopRecording();
        }
    }
  }, [isRecording]);

  const handleClearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAnswer('');
  };

  const handleGenerateQuestion = useCallback(async () => {
    if (!jobDescription || !resume) {
      setError('Por favor, preencha os campos de Vaga e Currículo.');
      return;
    }
    setError(null);
    setQuestion('');
    setAnswer('');
    setFeedback('');
    handleClearRecording();
    setIsLoadingQuestions(true);

    try {
      const generatedQuestion = await generateQuestion(jobDescription, resume);
      setQuestion(generatedQuestion);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao gerar a pergunta. Tente novamente.');
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [jobDescription, resume]);

  const handleEvaluateAnswer = useCallback(async () => {
    if (!answer && !audioURL) {
      setError('Por favor, digite ou grave sua resposta antes de avaliar.');
      return;
    }
    setError(null);
    setFeedback('');
    setIsLoadingFeedback(true);
    
    try {
      const textAnswer = answer || "O usuário forneceu apenas uma resposta em áudio.";
      const generatedFeedback = await evaluateAnswer(question, textAnswer);
      setFeedback(generatedFeedback);
      addHistoryItem({ question, answer, feedback: generatedFeedback, audioURL });
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao avaliar a resposta. Tente novamente.');
    } finally {
      setIsLoadingFeedback(false);
    }
  }, [question, answer, audioURL, addHistoryItem]);

  const handleResumeFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (file.size > 5 * 1024 * 1024) { setError("O arquivo é muito grande. O limite é 5MB."); return; }
    if (!/\.(txt|pdf|docx)$/i.test(file.name)) { setError("Tipo de arquivo não suportado. Por favor, anexe um arquivo .txt, .pdf, ou .docx."); return; }
    setError(null);
    setIsReadingFile(true);
    setResume('');
    setResumeFileName(null);
    try {
        const extension = file.name.split('.').pop()?.toLowerCase();
        let text = '';
        if (extension === 'txt') {
            text = await file.text();
        } else if (extension === 'pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let pdfText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                pdfText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
            }
            text = pdfText;
        } else if (extension === 'docx') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            text = result.value;
        }
        setResume(text);
        setResumeFileName(file.name);
    } catch (e) {
        console.error('Error reading file:', e);
        setError('Ocorreu um erro ao processar o arquivo. Verifique se o arquivo não está corrompido.');
    } finally {
        setIsReadingFile(false);
    }
  };
  
  const handleRemoveResumeFile = () => {
    setResume('');
    setResumeFileName(null);
  };

  const handleClear = () => {
    setJobDescription('');
    setResume('');
    setResumeFileName(null);
    setQuestion('');
    setAnswer('');
    setFeedback('');
    setError(null);
    if (isRecording) handleStopRecording();
    handleClearRecording();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="space-y-8 animate-fade-in">
        <Card>
        <div className="space-y-6">
            <div>
            <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">Forneça as informações</h2>
            <p className="text-slate-400">Cole a descrição da vaga e o seu currículo para gerarmos uma pergunta personalizada.</p>
            </div>
            <TextAreaInput id="job-description" label="📝 Vaga de Interesse" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Cole a descrição da vaga aqui" />
            <TextAreaInput 
              id="resume" 
              label="📋 Seu Currículo" 
              value={resume} 
              onChange={(e) => {
                setResume(e.target.value);
                setResumeFileName(null);
              }} 
              placeholder="Cole o seu currículo aqui ou anexe um arquivo" 
              onFileChange={handleResumeFileChange} 
              fileInputAccept=".pdf,.docx,.txt" 
              isFileReading={isReadingFile}
              fileName={resumeFileName}
              onRemoveFile={handleRemoveResumeFile}
            />
            <Button onClick={handleGenerateQuestion} disabled={isLoadingQuestions || !jobDescription || !resume}>
              {isLoadingQuestions && <LoadingSpinner />}
              {isLoadingQuestions ? 'Gerando...' : 'Gerar Pergunta'}
            </Button>
        </div>
        </Card>

        {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <p>{error}</p>
        </div>
        )}

        {question && !feedback && (
        <Card>
            <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">2. Responda à Pergunta</h2>
                <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg border border-slate-700 italic">
                "{question}"
                </p>
            </div>
            
            <div className="relative">
              <TextAreaInput id="answer" label="Sua Resposta (Texto)" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={isRecording ? "Ouvindo..." : "Digite sua resposta aqui, ou grave seu áudio para transcrevê-la..."} />
              {isRecording && <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Sua Resposta (Áudio)</label>
                <div className="bg-slate-900 border border-slate-700 rounded-md p-3 space-y-3">
                {!isRecording && !audioURL && (
                    <Button variant="secondary" onClick={handleStartRecording}>Gravar e Transcrever</Button>
                )}
                {isRecording && (
                    <Button variant="secondary" onClick={handleStopRecording} className="bg-red-600/20 border-red-500/50 text-red-300 hover:bg-red-600/40">Parar Gravação</Button>
                )}
                {audioURL && (
                    <div className="space-y-3">
                    <audio controls src={audioURL} className="w-full"></audio>
                    <Button variant="secondary" onClick={handleClearRecording}><TrashIcon/> Limpar Gravação</Button>
                    </div>
                )}
                </div>
            </div>

            <Button onClick={handleEvaluateAnswer} disabled={isLoadingFeedback || (!answer && !audioURL)}>
                {isLoadingFeedback && <LoadingSpinner />}
                {isLoadingFeedback ? 'Avaliando...' : 'Avaliar Resposta'}
            </Button>
            </div>
        </Card>
        )}

        {feedback && (
        <>
            <Card>
            <div className="space-y-4">
                <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100 mb-2">
                    <LightBulbIcon/>
                    Feedback da IA
                </h2>
                <div className="prose prose-invert prose-slate max-w-none text-slate-300 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{feedback}</ReactMarkdown>
                </div>
                {audioURL && (
                    <div className="pt-4 border-t border-slate-700/50">
                        <h3 className="text-base font-semibold text-slate-200 mb-2">Sua Gravação de Áudio</h3>
                        <audio controls src={audioURL} className="w-full"></audio>
                    </div>
                )}
            </div>
            </Card>
            <div className="mt-6">
            <Button onClick={handleClear} variant="secondary">Nova Simulação</Button>
            </div>
        </>
        )}
    </div>
  );
};

export default SimulatorView;
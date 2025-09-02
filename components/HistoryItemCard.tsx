import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDownIcon, TrashIcon } from './Icons';
import { HistoryItem } from '../hooks/useHistory';

interface HistoryItemCardProps {
  item: HistoryItem;
  onDelete?: () => void;
}

const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = new Date(item.timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-grow flex justify-between items-center text-left hover:bg-slate-700/50 transition-colors duration-200 -m-4 p-4"
          aria-expanded={isOpen}
          aria-controls={`history-content-${item.id}`}
        >
          <div className="flex-1 mr-4">
              <p className="font-medium text-slate-200">{item.question}</p>
              <p className="text-xs text-slate-500 mt-1">{formattedDate}</p>
          </div>
          <ChevronDownIcon className={`h-5 w-5 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {onDelete && (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }} 
                className="ml-4 p-2 rounded-full text-slate-400 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                aria-label="Deletar item do histórico"
            >
                <TrashIcon />
            </button>
        )}
      </div>
      <div
        id={`history-content-${item.id}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1500px]' : 'max-h-0'}`}
      >
        <div className={`p-4 border-t border-slate-700 space-y-4 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div>
            <h4 className="font-semibold text-slate-300 mb-2">Sua Resposta:</h4>
            {item.answer ? (
                <div className="prose prose-invert prose-slate max-w-none text-slate-400">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer}</ReactMarkdown>
                </div>
            ) : (
                <p className="text-slate-500 italic">Nenhuma resposta em texto fornecida.</p>
            )}
            {item.audioURL && (
                <div className="mt-3">
                    <audio controls src={item.audioURL} className="w-full"></audio>
                </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-slate-300 mb-2">Feedback da IA:</h4>
            <div className="prose prose-invert prose-slate max-w-none text-slate-400 bg-slate-800 p-3 rounded-md border border-slate-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.feedback}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItemCard;
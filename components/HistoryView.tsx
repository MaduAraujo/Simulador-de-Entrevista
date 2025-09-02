import React from 'react';
import { HistoryItem } from '../hooks/useHistory';
import HistoryItemCard from './HistoryItemCard';
import Button from './Button';
import { TrashIcon } from './Icons';

interface HistoryViewProps {
  history: HistoryItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onDeleteItem, onClearAll }) => {

  const handleClearAll = () => {
    if (window.confirm('Tem certeza de que deseja limpar todo o seu histórico? Esta ação não pode ser desfeita.')) {
      onClearAll();
    }
  };

  return (
    <div className="w-full animate-fade-in">
        <header className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-100">Seu Histórico de Simulações</h2>
            {history.length > 0 && (
                <Button variant="secondary" onClick={handleClearAll} className="w-auto text-sm bg-red-900/50 border-red-700 text-red-300 hover:bg-red-800/60 !py-2">
                    <TrashIcon />
                    Limpar Tudo
                </Button>
            )}
        </header>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/30 rounded-lg border border-slate-700">
          <p className="text-slate-400">Você ainda não tem nenhuma análise salva no seu histórico.</p>
          <p className="text-slate-500 mt-2 text-sm">Complete uma simulação para vê-la aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <HistoryItemCard 
              key={item.id} 
              item={item} 
              onDelete={() => onDeleteItem(item.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;

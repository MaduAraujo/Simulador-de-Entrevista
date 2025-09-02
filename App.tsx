import React, { useState } from 'react';
import { useHistory } from './hooks/useHistory';
import SimulatorView from './components/SimulatorView';
import HistoryView from './components/HistoryView';
import { HistoryIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'history'>('simulator');
  const { history, addHistoryItem, deleteHistoryItem, clearHistory } = useHistory();

  const renderContent = () => {
    switch (activeTab) {
      case 'simulator':
        return <SimulatorView addHistoryItem={addHistoryItem} />;
      case 'history':
        return <HistoryView history={history} onDeleteItem={deleteHistoryItem} onClearAll={clearHistory} />;
      default:
        return <SimulatorView addHistoryItem={addHistoryItem} />;
    }
  };

  const TabButton = ({ tabName, label, icon }: { tabName: 'simulator' | 'history'; label: string; icon: React.ReactNode; }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabName
          ? 'bg-blue-600 text-white'
          : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
      }`}
      aria-current={activeTab === tabName}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Simulador de Entrevista
          </h1>
          <p className="text-slate-400 mt-2">
            Prepare-se para sua próxima entrevista com a ajuda da IA.
          </p>
        </header>

        <nav className="flex justify-center mb-8 bg-slate-800/50 border border-slate-700 p-1.5 rounded-lg w-fit mx-auto" role="tablist">
          <TabButton tabName="simulator" label="Simulador" icon={<SparklesIcon />} />
          <TabButton tabName="history" label="Histórico" icon={<HistoryIcon />} />
        </nav>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;

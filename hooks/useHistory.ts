import { useState, useEffect, useCallback } from 'react';

export interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  feedback: string;
  audioURL?: string | null;
  timestamp: string;
}

const HISTORY_STORAGE_KEY = 'interview_simulator_history';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Falha ao carregar histórico do localStorage", error);
      setHistory([]);
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error("Falha ao salvar histórico no localStorage", error);
    }
  };

  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setHistory(prevHistory => {
      const newHistoryItem: HistoryItem = {
        ...item,
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [newHistoryItem, ...prevHistory];
      saveHistory(updatedHistory);
      return updatedHistory;
    });
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(item => item.id !== id);
      saveHistory(updatedHistory);
      return updatedHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return { history, addHistoryItem, deleteHistoryItem, clearHistory };
};

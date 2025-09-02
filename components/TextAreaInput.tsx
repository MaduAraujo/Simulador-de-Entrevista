import React from 'react';
import { UploadIcon, FileIcon, CloseIcon } from './Icons';
import LoadingSpinner from './LoadingSpinner';

interface TextAreaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputAccept?: string;
  isFileReading?: boolean;
  fileName?: string | null;
  onRemoveFile?: () => void;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  onFileChange, 
  fileInputAccept, 
  isFileReading,
  fileName,
  onRemoveFile
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        {onFileChange && (
          <label htmlFor={isFileReading ? undefined : `${id}-upload`} className={`text-sm text-blue-400 font-medium flex items-center gap-1.5 transition-colors duration-200 ${isFileReading ? 'opacity-75 cursor-not-allowed' : 'hover:text-blue-300 cursor-pointer'}`}>
            {isFileReading ? (
                <>
                    <LoadingSpinner size="sm" />
                    Lendo arquivo...
                </>
            ) : (
                <>
                    <UploadIcon />
                    Anexar arquivo
                </>
            )}
            <input
              id={`${id}-upload`}
              type="file"
              className="hidden"
              onChange={onFileChange}
              accept={fileInputAccept}
              disabled={isFileReading}
            />
          </label>
        )}
      </div>
      {fileName ? (
        <div className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-200 flex items-center justify-between transition-all duration-300 h-[178px]">
            <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon />
                <span className="truncate text-sm font-medium">{fileName}</span>
            </div>
            {onRemoveFile && (
                <button 
                    onClick={onRemoveFile} 
                    className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700/80 hover:text-white transition-colors"
                    aria-label="Remover arquivo"
                >
                    <CloseIcon />
                </button>
            )}
        </div>
      ) : (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={8}
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      )}
    </div>
  );
};

export default TextAreaInput;
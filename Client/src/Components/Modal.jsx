import React from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

const Modal = ({ message, onClose, type = 'success' }) => {
  const isSuccess = type === 'success';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative card p-8 max-w-md w-full text-center">
        <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
          isSuccess ? 'bg-success/20' : 'bg-danger/20'
        }`}>
          {isSuccess ? (
            <FiCheck className="w-8 h-8 text-success" />
          ) : (
            <div className="w-8 h-8 text-danger text-2xl font-bold">!</div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          {isSuccess ? 'Success!' : 'Notice'}
        </h2>
        
        <p className="text-text-secondary mb-8 text-lg">
          {message}
        </p>
        
        <button 
          onClick={onClose}
          className="btn-primary w-full"
        >
          Continue
        </button>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-secondary transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Modal;

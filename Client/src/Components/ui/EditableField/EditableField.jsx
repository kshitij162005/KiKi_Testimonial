import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Check, X, Upload } from 'lucide-react';
import { cn } from '../../../lib/utils';
import Button from '../Button/Button';
import './EditableField.css';

const EditableField = ({
  value,
  onSave,
  type = 'text',
  placeholder = 'Click to edit...',
  label,
  validation,
  confirmationMessage,
  className,
  disabled = false,
  multiline = false,
  maxLength,
  required = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setEditValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text' || type === 'email') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value || '');
    setError('');
  };

  // Handle click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEditing && inputRef.current && !inputRef.current.closest('.editable-field-edit').contains(event.target)) {
        handleCancel();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (disabled || isLoading) return;

    // Validation
    if (required && !editValue.trim()) {
      setError('This field is required');
      return;
    }

    if (validation) {
      const validationError = validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (maxLength && editValue.length > maxLength) {
      setError(`Maximum ${maxLength} characters allowed`);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await onSave(editValue);
      setIsEditing(false);
      
      if (confirmationMessage) {
        // You can integrate with a toast system here
        console.log(confirmationMessage);
      }
    } catch (err) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditValue(file);
    }
  };

  const renderInput = () => {
    const baseProps = {
      ref: inputRef,
      value: type === 'file' ? '' : editValue,
      onChange: (e) => setEditValue(e.target.value),
      onKeyDown: handleKeyDown,
      placeholder,
      disabled: isLoading,
      maxLength,
      className: cn(
        'editable-input',
        {
          'editable-input-error': error,
          'editable-input-loading': isLoading
        }
      )
    };

    switch (type) {
      case 'textarea':
      case 'multiline':
        return (
          <textarea
            {...baseProps}
            rows={3}
            className={cn(baseProps.className, 'editable-textarea')}
          />
        );
      
      case 'file':
        return (
          <div className="editable-file-input">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="w-4 h-4" />
              Choose File
            </Button>
            {editValue && (
              <span className="text-sm text-gray-400">
                {editValue.name || 'File selected'}
              </span>
            )}
          </div>
        );
      
      case 'email':
        return <input {...baseProps} type="email" />;
      
      case 'number':
        return <input {...baseProps} type="number" />;
      
      default:
        return <input {...baseProps} type="text" />;
    }
  };

  const displayValue = () => {
    if (!value) return placeholder;
    if (type === 'file' && value.name) return value.name;
    return value;
  };

  return (
    <div className={cn('editable-field', className)}>
      {label && (
        <label className="editable-field-label">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="editable-field-container">
        {!isEditing ? (
          <div 
            className={cn(
              'editable-field-display',
              {
                'editable-field-empty': !value,
                'editable-field-disabled': disabled
              }
            )}
            onClick={handleEdit}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEdit();
              }
            }}
          >
            <span className="editable-field-value">
              {displayValue()}
            </span>
            {!disabled && (
              <Edit2 className="editable-field-icon" />
            )}
          </div>
        ) : (
          <div className="editable-field-edit">
            <div className="editable-field-input-container">
              {renderInput()}
              {maxLength && (
                <div className="editable-field-counter">
                  {editValue.length}/{maxLength}
                </div>
              )}
            </div>
            
            <div className="editable-field-actions">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                loading={isLoading}
                disabled={isLoading}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="editable-field-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default EditableField;
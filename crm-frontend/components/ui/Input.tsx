"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label" htmlFor={id}>{label}</label>}
        <input
          ref={ref}
          id={id}
          className={`form-input ${error ? "error" : ""} ${className}`}
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
        {hint && !error && (
          <span className="text-xs text-muted">{hint}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, id, className = "", ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label" htmlFor={id}>{label}</label>}
        <select
          ref={ref}
          id={id}
          className={`form-input ${error ? "error" : ""} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label" htmlFor={id}>{label}</label>}
        <textarea
          ref={ref}
          id={id}
          className={`form-input ${error ? "error" : ""} ${className}`}
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

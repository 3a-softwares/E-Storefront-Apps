import React from 'react';

// Mock Button component
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
    loading?: boolean;
    fullWidth?: boolean;
  }
> = ({ children, ...props }) => <button {...props}>{children}</button>;

// Mock Input component
export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
  }
> = ({ label, error, ...props }) => (
  <div>
    {label && <label>{label}</label>}
    <input {...props} />
    {error && <span className="error">{error}</span>}
  </div>
);

// Mock Card component
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={className}>{children}</div>;

// Mock Modal component
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div data-testid="modal">
      {title && <h2>{title}</h2>}
      <button onClick={onClose} data-testid="modal-close">
        Close
      </button>
      {children}
    </div>
  );
};

// Mock Select component
export const Select: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  label?: string;
  className?: string;
  error?: string;
}> = ({ value, onChange, options = [], label, className, error }) => (
  <div className={className}>
    {label && <label>{label}</label>}
    <select value={value} onChange={(e) => onChange?.(e.target.value)} data-testid="mock-select">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <span className="error">{error}</span>}
  </div>
);

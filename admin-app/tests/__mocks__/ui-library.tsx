import React from 'react';

// Mock Button component
export const Button: React.FC<{
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}> = ({ children, onClick, className, disabled, type = 'button', size, ...props }) => (
  <button
    type={type}
    onClick={onClick}
    className={className}
    disabled={disabled}
    aria-label={props['aria-label']}
    data-testid="mock-button"
    data-size={size}
  >
    {children}
  </button>
);

// Mock Input component
export const Input: React.FC<{
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
}> = ({ value, onChange, placeholder, type = 'text', className, name, id, disabled }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
    name={name}
    id={id}
    disabled={disabled}
    data-testid="mock-input"
  />
);

// Mock Header component
export const Header: React.FC<{
  logoUrl?: string;
  appName?: string;
  theme?: string;
  onToggleTheme?: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  user?: { name: string };
  onLogout?: () => void;
}> = ({ appName, theme, onToggleTheme, language, onLanguageChange, user, onLogout }) => (
  <header data-testid="mock-header">
    <span data-testid="app-name">{appName}</span>
    {theme && <span data-testid="theme">{theme}</span>}
    {onToggleTheme && (
      <button onClick={onToggleTheme} data-testid="theme-toggle">
        Toggle Theme
      </button>
    )}
    {language && <span data-testid="language">{language}</span>}
    {onLanguageChange && (
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        data-testid="language-select"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    )}
    {user && <span data-testid="user-name">{user.name}</span>}
    {user && onLogout && (
      <button onClick={onLogout} data-testid="logout-button">
        Logout
      </button>
    )}
  </header>
);

// Mock Card component
export const Card: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={className} data-testid="mock-card">
    {children}
  </div>
);

// Mock Modal component
export const Modal: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) =>
  isOpen ? (
    <div data-testid="mock-modal">
      <div data-testid="modal-title">{title}</div>
      <button onClick={onClose} data-testid="modal-close">
        Close
      </button>
      {children}
    </div>
  ) : null;

// Mock Select component
export const Select: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}> = ({ value, onChange, options = [], placeholder }) => (
  <select value={value} onChange={(e) => onChange?.(e.target.value)} data-testid="mock-select">
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// Mock Badge component
export const Badge: React.FC<{
  children?: React.ReactNode;
  variant?: string;
}> = ({ children, variant }) => (
  <span data-testid="mock-badge" data-variant={variant}>
    {children}
  </span>
);

// Mock Spinner/Loading component
export const Spinner: React.FC<{
  size?: string;
}> = ({ size }) => <div data-testid="mock-spinner" data-size={size} />;

export const Loading: React.FC = () => <div data-testid="mock-loading">Loading...</div>;

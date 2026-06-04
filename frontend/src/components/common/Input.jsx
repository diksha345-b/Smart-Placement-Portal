import { forwardRef } from 'react';

/**
 * Reusable text input with label + error message. Designed to work with
 * react-hook-form via ref forwarding ({...register('field')}).
 */
const Input = forwardRef(
  ({ label, error, type = 'text', className = '', id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className={className}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`form-input ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
          {...rest}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

import { forwardRef } from 'react';

/**
 * Reusable textarea with label + error, ref-forwarded for react-hook-form.
 */
const Textarea = forwardRef(
  ({ label, error, rows = 4, className = '', id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className={className}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={`form-input resize-y ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
          {...rest}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

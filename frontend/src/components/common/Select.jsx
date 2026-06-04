import { forwardRef } from 'react';

/**
 * Reusable select. `options` may be an array of strings or { value, label }.
 */
const Select = forwardRef(
  ({ label, error, options = [], placeholder, className = '', id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className={className}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <select
          id={inputId}
          ref={ref}
          className={`form-input bg-white ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

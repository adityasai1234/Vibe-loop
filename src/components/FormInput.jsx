import React from 'react';

/**
 * A responsive form input component with label
 * 
 * @param {Object} props
 * @param {string} props.id - Input ID (required for accessibility)
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.label - Label text
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler function
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.error - Error message to display
 * @param {number} props.animationOrder - Order for staggered animation (1-4)
 * @returns {JSX.Element}
 */
const FormInput = ({
  id,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  animationOrder = 1
}) => {
  return (
    <div className={`space-y-1 animate-fadeIn form-element-${animationOrder}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full h-12 px-4 rounded-lg border ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} 
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
          dark:bg-gray-700 dark:text-white transition-colors duration-200 auth-input`}
      />
      
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1 animate-slideIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
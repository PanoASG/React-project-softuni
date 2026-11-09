function FormField({
  label,
  name,
  type = 'text',
  as = 'input',
  options = [],
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
}) {
  const errorId = `${name}-error`

  const fieldProps = {
    id: name,
    name,
    value,
    onChange,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
  }

  let control
  if (as === 'textarea') {
    control = <textarea {...fieldProps} rows={8} placeholder={placeholder} />
  } else if (as === 'select') {
    control = (
      <select {...fieldProps}>
        <option value="">{placeholder ?? 'Choose...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  } else {
    control = <input {...fieldProps} type={type} placeholder={placeholder} autoComplete={autoComplete} />
  }

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {control}
      {error && (
        <p id={errorId} className="form-field__error">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField

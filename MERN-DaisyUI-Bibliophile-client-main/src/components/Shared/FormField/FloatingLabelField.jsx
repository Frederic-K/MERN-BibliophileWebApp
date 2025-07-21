import clsx from "clsx"

function FloatingLabelField({
  label,
  name,
  register,
  error,
  type = "text",
  options = [],
  containerClassName,
  onChange,
  ...props
}) {
  const baseClasses = ""
  const errorClasses = error ? "input-error" : ""

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            className={clsx(baseClasses, "textarea textarea-bordered", errorClasses)}
            placeholder={label}
            {...register(name)}
            onChange={onChange}
            {...props}
          />
        )
      case "select":
        return (
          <select
            className={clsx(baseClasses, "select select-bordered", errorClasses)}
            {...register(name)}
            onChange={onChange}
            {...props}
          >
            <option disabled value="">
              {label}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case "number":
        return (
          <input
            type="number"
            className={clsx(baseClasses, "input", errorClasses)}
            placeholder={label}
            {...register(name)}
            onChange={onChange}
            {...props}
          />
        )
      default:
        return (
          <input
            type={type}
            className={clsx(baseClasses, "input", errorClasses)}
            placeholder={label}
            {...register(name)}
            onChange={onChange}
            {...props}
          />
        )
    }
  }

  return (
    <div className={clsx("form-control w-full", containerClassName)}>
      <label className="floating-label">
        <span className="label-text">{label}</span>
        {renderInput()}
      </label>
      {error && <p className="validator-hint text-red-600">{error.message}</p>}
    </div>
  )
}

export default FloatingLabelField

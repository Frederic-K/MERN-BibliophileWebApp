import clsx from "clsx"

const IconPrefixedField = ({
  type,
  placeholder,
  register,
  name,
  error,
  className,
  icon,
  ...props
}) => {
  return (
    <div className={clsx("form-control w-full", className)}>
      <label className="input">
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          className={clsx("w-full", error && "input-error")}
          {...register(name)}
          {...props}
        />
      </label>
      {error && <p className="validator-hint text-red-600">{error.message}</p>}
    </div>
  )
}

export default IconPrefixedField

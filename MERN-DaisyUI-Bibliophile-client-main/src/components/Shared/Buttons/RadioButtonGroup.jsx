import RadioButton from "./RadioButton"

const RadioButtonGroup = ({ title, name, options, value, onChange }) => {
  return (
    <section className="mb-6">
      {title && <h2 className="mb-2 text-2xl font-bold">{title}</h2>}
      <div className="grid w-80 grid-cols-2 gap-x-14 gap-y-4">
        {options.map((option) => (
          <RadioButton
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  )
}

export default RadioButtonGroup

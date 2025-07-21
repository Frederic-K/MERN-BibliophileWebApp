const RadioButton = ({ name, value, label, checked, onChange }) => {
  return (
    <label className="label w-full gap-3">
      <input
        type="radio"
        name={name}
        className="radio"
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <span className="label-text">{label}</span>
    </label>
  )
}

export default RadioButton

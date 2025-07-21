import { useTranslation } from "react-i18next"

const ToggleSwitch = ({ isOn, isLoading, onToggle }) => {
  const { t } = useTranslation()

  return (
    <label className="toggle text-base-content toggle-xl">
      <input
        type="checkbox"
        checked={!isOn}
        onChange={onToggle}
        disabled={isLoading}
        className="sr-only"
      />
      <svg
        aria-label="enabled"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        // className={clsx("transition-opacity", isOn ? "opacity-100" : "opacity-0")}
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          fill="none"
          stroke="currentColor"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </g>
      </svg>
      <svg
        aria-label="disabled"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        // className={clsx("transition-opacity", isOn ? "opacity-0" : "opacity-100")}
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </label>
  )
}

export default ToggleSwitch

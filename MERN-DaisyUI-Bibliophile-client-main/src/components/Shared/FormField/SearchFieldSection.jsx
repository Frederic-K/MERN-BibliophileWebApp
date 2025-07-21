import { useTranslation } from "react-i18next"
import IconSubmitButton from "../Buttons/IconSubmitButton"

const SearchFieldSection = ({
  register,
  errors,
  searchTerm,
  handleReset,
  setIsExpanded,
  isExpanded,
}) => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col">
      <div className="flex gap-2">
        <label className="input flex-grow">
          <svg
            className="h-[2em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="text"
            // required
            {...register("searchTerm")}
            placeholder={t("searchBar.placeholder")}
          />
          {searchTerm && (
            <button type="button" className="btn btn-ghost btn-circle btn-xs" onClick={handleReset}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </label>

        <button type="button" className="btn" onClick={() => setIsExpanded(!isExpanded)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
        </button>
        <IconSubmitButton ariaLabel={t("common.submit")} />
      </div>
      {errors.searchTerm && (
        <p className="validator-hint text-red-600">{errors.searchTerm.message}</p>
      )}
    </section>
  )
}

export default SearchFieldSection

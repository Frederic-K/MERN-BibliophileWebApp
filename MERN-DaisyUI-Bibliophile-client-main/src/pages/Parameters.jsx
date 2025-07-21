import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useThemeStore } from "../lib/store/themeStore"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import RadioButtonGroup from "../components/Shared/Buttons/RadioButtonGroup"

const LANGUAGES = [
  { value: "en", label: "parametersPage.language.english" },
  { value: "fr", label: "parametersPage.language.french" },
]

const THEMES = [
  { value: "light", label: "parametersPage.theme.light" },
  { value: "dark", label: "parametersPage.theme.dark" },
]

// Directly map because no translation is needed
const DAISY_UI_THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
].map((theme) => ({ value: theme, label: theme }))

function Parameters() {
  const { isDarkTheme, setDarkTheme, daisyUITheme, setDaisyUITheme } = useThemeStore()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLanguageChange = (event) => {
    const newLocale = event.target.value
    i18n.changeLanguage(newLocale).then(() => {
      const currentPath = location.pathname
      const newPath = `/${newLocale}${currentPath.substring(3) || "/"}`
      navigate(newPath)
    })
  }

  const handleThemeChange = (event) => {
    const theme = event.target.value
    if (theme === "light") {
      setDarkTheme(false)
    } else if (theme === "dark") {
      setDarkTheme(true)
    }
    setDaisyUITheme(theme)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pb-20">
      <PageHeader
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        }
        titleKey={"parametersPage.title"}
        descriptionKey={"parametersPage.description"}
      />

      <RadioButtonGroup
        title={t("parametersPage.language.title")}
        name="language-radios"
        // Map over LANGUAGES array, spreading each language object and translating its label
        options={LANGUAGES.map((lang) => ({ ...lang, label: t(lang.label) }))}
        value={i18n.language}
        onChange={handleLanguageChange}
      />

      <RadioButtonGroup
        title={t("parametersPage.theme.title")}
        name="theme-radios"
        options={THEMES.map((theme) => ({ ...theme, label: t(theme.label) }))}
        value={isDarkTheme ? "dark" : "light"}
        onChange={handleThemeChange}
      />

      <RadioButtonGroup
        title={t("parametersPage.theme.daisyUI")}
        name="daisyUI-theme-radios"
        options={DAISY_UI_THEMES}
        value={daisyUITheme}
        onChange={handleThemeChange}
      />
    </main>
  )
}

export default Parameters

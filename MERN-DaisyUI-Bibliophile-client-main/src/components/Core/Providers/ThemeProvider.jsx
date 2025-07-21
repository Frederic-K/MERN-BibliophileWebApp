import { useThemeStore } from "../../../lib/store/themeStore"

export function ThemeProvider({ children }) {
  const isDarkTheme = useThemeStore((state) => state.isDarkTheme)
  const daisyUITheme = useThemeStore((state) => state.daisyUITheme)

  return (
    <div className={isDarkTheme ? "dark" : ""} data-theme={daisyUITheme}>
      {children}
    </div>
  )
}

export default ThemeProvider

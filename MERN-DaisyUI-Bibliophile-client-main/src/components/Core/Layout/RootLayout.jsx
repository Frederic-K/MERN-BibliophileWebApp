import { Outlet, useParams, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Navigation from "../../Navigation/Navigation"

function RootLayout() {
  const { lang } = useParams()
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  useEffect(() => {
    const supportedLangs = ["en", "fr"] // Add more languages as needed
    if (!supportedLangs.includes(lang)) {
      navigate("/fr", { replace: true })
    } else {
      i18n.changeLanguage(lang)
    }
  }, [lang, navigate, i18n])

  return (
    <div className="font-exo2 relative flex min-h-screen flex-col antialiased">
      <main className="grow">
        <Outlet />
      </main>
      <Navigation />
    </div>
  )
}

export default RootLayout

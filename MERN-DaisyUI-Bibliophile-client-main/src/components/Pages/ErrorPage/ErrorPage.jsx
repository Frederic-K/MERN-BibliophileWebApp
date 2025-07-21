import { Link, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

function ErrorPage({ errorType }) {
  const { t } = useTranslation()
  const { lang } = useParams()

  const errorTypes = {
    notFound: "notFoundPage",
    server: "errorPage.server",
    network: "errorPage.network",
    serviceUnavailable: "errorPage.serviceUnavailable",
  }

  const translationKey = errorTypes[errorType] || errorTypes.notFound

  return (
    <main className="hero bg-base-100 min-h-screen pb-20">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{t(`${translationKey}.title`)}</h1>
          <p className="mt-4 mb-6">{t(`${translationKey}.description`)}</p>
          <Link to={`/${lang}`} className="btn" role="button">
            {t(`${translationKey}.button`)}
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ErrorPage

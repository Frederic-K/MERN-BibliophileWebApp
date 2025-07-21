import React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    console.error("Uncaught error:", error, errorInfo)
    toast.error("An unexpected error occurred. We're looking into it.")
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  clearDataAndRefresh = () => {
    localStorage.clear()
    window.location.reload()
  }

  render() {
    const { t, lang } = this.props

    if (this.state.hasError) {
      return (
        <main className="hero bg-base-100 min-h-screen pb-20">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">{t("errorPage.boundary.title")}</h1>
              <p className="mt-4 mb-6">{t("errorPage.boundary.description")}</p>
              <div className="flex flex-col gap-4">
                <button onClick={this.handleRetry} className="btn btn-primary">
                  {t("errorPage.boundary.retryButton")}
                </button>
                <Link to={`/${lang}`} className="btn" role="button">
                  {t("errorPage.boundary.homeButton")}
                </Link>
                <button onClick={() => window.location.reload()} className="btn btn-secondary">
                  {t("errorPage.boundary.refreshButton")}
                </button>
                <button onClick={this.clearDataAndRefresh} className="btn btn-warning">
                  {t("errorPage.boundary.clearDataButton")}
                </button>
              </div>
              {this.props.showErrorDetails && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer font-semibold">
                    {t("errorPage.boundary.detailsTitle")}
                  </summary>
                  <pre className="bg-base-200 mt-2 overflow-auto rounded p-4 text-sm">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

function ErrorBoundary({ children, showErrorDetails = false }) {
  const navigate = useNavigate()
  const { lang } = useParams()
  const { t } = useTranslation()

  return (
    <ErrorBoundaryClass navigate={navigate} lang={lang} t={t} showErrorDetails={showErrorDetails}>
      {children}
    </ErrorBoundaryClass>
  )
}

export default ErrorBoundary

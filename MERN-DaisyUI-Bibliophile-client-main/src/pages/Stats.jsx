import { useTranslation } from "react-i18next"
import PageHeader from "../components/Shared/PageHeaders/PageHeader"
import Loader from "../components/Shared/Loader/Loader"
import { useUserStats } from "../lib/hooks/useUserStats"

function Stats() {
  const { t } = useTranslation()
  const { stats, isLoading } = useUserStats()

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-col items-center justify-center pb-20">
      <PageHeader
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        }
        titleKey="statsPage.title"
        descriptionKey="statsPage.description"
      />

      <section className="mt-4 mb-4 flex flex-col gap-4">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">{t("statsPage.totalUserBookshelfItems")}</div>
            <div className="stat-value">{stats?.totalUserBookshelfItems ?? 0}</div>
            <div className="stat-desc">
              {t("statsPage.lastMonthNewItems", { count: stats?.lastMonthNewItems ?? 0 })}
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">{t("statsPage.readItems")}</div>
            <div className="stat-value">{stats?.readItems ?? 0}</div>
            <div className="stat-desc">
              {t("statsPage.lastMonthReadItems", { count: stats?.lastMonthReadItems ?? 0 })}
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">{t("statsPage.unreadItems")}</div>
            <div className="stat-value">{stats?.unreadItems ?? 0}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">{t("statsPage.favoriteItems")}</div>
            <div className="stat-value">{stats?.favoriteItems ?? 0}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">{t("statsPage.highRatedItems")}</div>
            <div className="stat-value">{stats?.highRatedItems ?? 0}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">{t("statsPage.totalBooks")}</div>
            <div className="stat-value">{stats?.totalBooks ?? 0}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">{t("statsPage.totalAuthors")}</div>
            <div className="stat-value">{stats?.totalAuthors ?? 0}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">{t("statsPage.totalPagesRead")}</div>
            <div className="stat-value">{stats?.totalPagesRead ?? 0}</div>
            <div className="stat-desc">
              {t("statsPage.lastMonthPagesRead", { count: stats?.lastMonthPagesRead ?? 0 })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Stats

import { useTranslation } from "react-i18next"

function PageHeader({ icon, titleKey, descriptionKey }) {
  const { t } = useTranslation()

  return (
    <section className="mt-3 flex w-80 items-center justify-between gap-4">
      <div className="flex w-16 items-center justify-center">{icon}</div>
      <div className="flex flex-1 flex-col items-start justify-center">
        <h1 className="text-2xl font-bold">{t(titleKey)}</h1>
        <h2 className="text-sm">{t(descriptionKey)}</h2>
      </div>
    </section>
  )
}

export default PageHeader

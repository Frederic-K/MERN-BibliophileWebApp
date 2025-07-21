import { useTranslation } from "react-i18next"
import clsx from "clsx"

function AdminUserHeader({ currentEditUser, isUploading, uploadError, handleImageUpload }) {
  const { t } = useTranslation()

  return (
    <section className="mt-4 mb-4 flex w-80 items-center gap-4">
      <div className="group avatar relative">
        <div className="ring-primary ring-offset-base-100 h-16 w-16 overflow-hidden rounded-full ring-3 ring-offset-2">
          <img
            src={currentEditUser?.profileImage || "/assets/moonProfile.webp"}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
          <div
            className={clsx(
              "absolute inset-0 flex items-center justify-center rounded-full bg-black/50",
              isUploading ? "opacity-100" : "opacity-0 transition-opacity group-hover:opacity-100"
            )}
          >
            {isUploading ? (
              <span className="loading loading-ring loading-md text-white"></span>
            ) : (
              <label
                htmlFor="fileInput"
                className="flex h-full w-full cursor-pointer items-center justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
            )}
          </div>
        </div>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept=".png, .jpeg, .jpg, .webp"
          onChange={handleImageUpload}
          aria-label="Upload profile picture"
        />
      </div>

      <div className="">
        <h1 className="text-2xl font-bold">{t("userPage.editUserPage.title")}</h1>
        <h2 className="text-sm">{t("userPage.editUserPage.description")}</h2>
        <div className={clsx("mt-2", uploadError ? "text-error" : "")}>{uploadError || ""}</div>
      </div>
    </section>
  )
}

export default AdminUserHeader

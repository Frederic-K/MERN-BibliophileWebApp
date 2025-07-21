import clsx from "clsx"
import { useTranslation } from "react-i18next"

function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmButtonClass,
}) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-10 bg-black/50" />
      <dialog className="modal modal-middle" open>
        <div className="modal-box">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action">
            <button onClick={onConfirm} className={clsx("btn", confirmButtonClass)}>
              {confirmText || t("common.confirm")}
            </button>
            <button onClick={onCancel} className="btn">
              {cancelText || t("common.cancel")}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}

export default ConfirmationModal

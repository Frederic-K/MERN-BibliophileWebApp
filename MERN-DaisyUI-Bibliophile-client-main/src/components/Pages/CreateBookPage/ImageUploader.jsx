import { useState } from "react"
import clsx from "clsx"

const ImageUploader = ({ imagePreview, onImageChange, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      onImageChange({ target: { files } })
    }
  }

  return (
    <div
      className="group relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className={clsx(
          "h-64 w-80",
          "overflow-hidden",
          "rounded-lg",
          "ring-3",
          "ring-primary",
          "ring-offset-2",
          "ring-offset-base-100",
          "mb-2",
          isDragging && "ring-secondary ring-4"
        )}
      >
        <img
          src={imagePreview || "/assets/bookCoverImage.webp"}
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <div
          className={clsx(
            "absolute inset-0 flex h-64 w-80 items-center justify-center rounded-lg bg-black/50",
            isLoading ? "opacity-100" : "opacity-0 transition-opacity group-hover:opacity-100"
          )}
        >
          {isLoading ? (
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
        onChange={onImageChange}
      />
      {error && <p className="validator-hint mt-0 text-red-600">{error}</p>}
    </div>
  )
}

export default ImageUploader

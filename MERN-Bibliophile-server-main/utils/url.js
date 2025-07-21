import config from "../config/config.js"

export const buildFrontendUrl = (path, options = {}) => {
  const { params = {}, query = {}, lang = "en" } = options
  const baseUrl = config.frontendBaseUrl.replace(/\/$/, "")

  // Handle path segments
  let urlPath = path
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        const paramName = segment.slice(1)
        return params[paramName] || segment
      }
      return segment
    })
    .join("/")

  // Construct URL
  const url = new URL(`${baseUrl}/${lang}/${urlPath}`)

  // Add query parameters
  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  return url.toString()
}

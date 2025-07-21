import React from "react"

export const formatSummary = (summary, options = {}) => {
  const { maxLength, formatType = "original" } = options

  if (!summary || typeof summary !== "string") {
    return null
  }

  switch (formatType) {
    case "truncate":
      return truncateSummary(summary, maxLength)
    case "paragraphs":
      return formatSummaryIntoParagraphs(summary)
    case "original":
    default:
      return summary
  }
}

const truncateSummary = (summary, maxLength) => {
  if (!maxLength || summary.length <= maxLength) {
    return summary
  }
  return summary.substring(0, maxLength) + "..."
}

const formatSummaryIntoParagraphs = (summary) => {
  const sentences = summary.split(".").filter((sentence) => sentence.trim())
  return sentences.map((sentence, index) => (
    <React.Fragment key={index}>
      {sentence.trim()}.{index < sentences.length - 1 && <br />}
    </React.Fragment>
  ))
}

export default {
  errorPage: {
    server: {
      title: "Server Error",
      description:
        "The server encountered an unexpected error and could not complete your request.",
      button: "Refresh",
    },
    network: {
      title: "Network Error",
      description:
        "There was a problem with your internet connection. Please check your connection and try again.",
      button: "Retry",
    },
    serviceUnavailable: {
      title: "Service Unavailable",
      description:
        "The service is temporarily unavailable. We're working on it and will be back soon.",
      button: "Try Again (30s)",
    },
    boundary: {
      title: "Oops! Something went wrong",
      description: "We're sorry for the inconvenience. Here are some options:",
      retryButton: "Try Again",
      homeButton: "Return to Home",
      refreshButton: "Refresh Page",
      clearDataButton: "Clear Data and Refresh",
      detailsTitle: "Error Details",
    },
  },
}

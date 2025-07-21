import { I18nextProvider } from "react-i18next"
import { ThemeProvider } from "./ThemeProvider"
import i18n from "../../../i18n"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Providers = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        {children}
        <ToastContainer
          position="bottom-left"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default Providers

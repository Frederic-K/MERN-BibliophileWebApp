import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"

import AxiosInterceptor from "./components/Core/AxiosInterceptor/AxiosInterceptor"
import ErrorBoundary from "./components/Core/ErrorBoundary/ErrorBoundary"
import Providers from "./components/Core/Providers/Providers"
import RootLayout from "./components/Core/Layout/RootLayout"
import { PrivateRoute, ManagementRoute } from "./components/Core/ProtectedRoute/ProtectedRoute"

import AdminDashboard from "./pages/AdminDashboard"
import Author from "./pages/Author"
import Book from "./pages/Book"
import Bookshelf from "./pages/Bookshelf"
import BookshelfItem from "./pages/BookshelfItem"
import CreateAuthor from "./pages/CreateAuthor"
import CreateBook from "./pages/CreateBook"
import EditBook from "./pages/EditBook"
import EditAuthor from "./pages/EditAuthor"
import EditUser from "./pages/EditUser"
import ForgotPassword from "./pages/ForgotPassword"
import Library from "./pages/Library"
import NetworkError from "./pages/NetworkError"
import NotFound from "./pages/NotFound"
import Parameters from "./pages/Parameters"
import Reading from "./pages/Reading"
import Registration from "./pages/Registration"
import ResetPassword from "./pages/ResetPassword"
import ServerError from "./pages/ServerError"
import ServiceUnavailable from "./pages/ServiceUnavailable"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Stats from "./pages/Stats"
import User from "./pages/User"
import VerifyEmail from "./pages/VerifyEmail"
import VerifyNewEmail from "./pages/VerifyNewEmail"
import WishList from "./pages/WishList"

import AdminTabContent from "./components/Pages/AdminDashboardPage/AdminTabContent"

// Public routes
const PublicRoutes = [
  { path: "sign-in", element: <SignIn /> },
  { path: "sign-up", element: <SignUp /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "reset-password/:token?", element: <ResetPassword /> },
  { path: "verify-email/:token?", element: <VerifyEmail /> },
  { path: "verify-new-email/:token?", element: <VerifyNewEmail /> },
]

// Private routes
const PrivateRoutes = [
  { index: true, element: <Reading /> },
  { path: "library", element: <Library /> },
  { path: "bookshelf", element: <Bookshelf /> },
  { path: "bookshelfItem/:slug?", element: <BookshelfItem /> },
  { path: "book/:slug?", element: <Book /> },
  { path: "author/:slug?", element: <Author /> },
  { path: "user", element: <User /> },
  { path: "wishlist", element: <WishList /> },
  { path: "parameters", element: <Parameters /> },
  { path: "stats", element: <Stats /> },
]

// Management routes
const ManagementRoutes = [
  {
    path: "admin-dashboard",
    element: <AdminDashboard />,
    children: [
      { index: true, element: <Navigate to="users" replace /> },
      { path: ":tab", element: <AdminTabContent /> },
    ],
  },
  { path: "create-author", element: <CreateAuthor /> },
  { path: "create-book", element: <CreateBook /> },
  { path: "edit-book/:bookId?", element: <EditBook /> },
  { path: "edit-author/:authorId?", element: <EditAuthor /> },
  { path: "edit-user/:userId?", element: <EditUser /> },
  { path: "registration", element: <Registration /> },
]

const ErrorRoutes = [
  { path: "network-error", element: <NetworkError /> },
  { path: "server-error", element: <ServerError /> },
  { path: "service-unavailable", element: <ServiceUnavailable /> },
]

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/fr" replace />,
  },
  {
    path: "/:lang",
    element: (
      <ErrorBoundary>
        <AxiosInterceptor>
          <RootLayout />
        </AxiosInterceptor>
      </ErrorBoundary>
    ),
    children: [
      ...PublicRoutes,
      ...ErrorRoutes,
      {
        element: <PrivateRoute />,
        children: PrivateRoutes,
      },
      {
        element: <ManagementRoute />,
        children: ManagementRoutes,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
])

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}

export default App

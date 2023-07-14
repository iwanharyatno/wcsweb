import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Routes from "./Routes"
import ErrorPage from "./shared/ErrorPage";
import { MessageBoxContextProvider } from "./shared/MessageBoxContext";
import { DownloadContextProvider } from "./shared/DownloadContext";

const router = createBrowserRouter(Routes.map(r => ({...r, errorElement: <ErrorPage />})));

function App() {
  return (
    <MessageBoxContextProvider>
        <DownloadContextProvider>
          <RouterProvider router={router} />
        </DownloadContextProvider>
    </MessageBoxContextProvider>
  )
}

export default App

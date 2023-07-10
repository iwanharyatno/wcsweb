import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Routes from "./Routes"
import { useState } from "react";
import MessageBoxContext from "./shared/MessageBoxContext";
import MessageBox from "./shared/MessageBox";
import ErrorPage from "./shared/ErrorPage";

const router = createBrowserRouter(Routes.map(r => ({...r, errorElement: <ErrorPage />})));

function App() {
  const [messages, setMessages] = useState([]);

  const removeMessage = (id) => {
      setMessages(messages.filter(m => m.id !== id));
  };

  const addMessage = ({ type, message }) => {
      const updated = [...messages];
      updated.push({
          id: +new Date(),
          type, message
      });
      setMessages(updated);
  };

  return (
    <MessageBoxContext.Provider value={{
      showMessage: (message) => addMessage(message)
  }}>
      {messages.length > 0 &&
          <div className="z-50 fixed top-0 w-full md:right-0 md:w-96 flex flex-col gap-3 p-4">
              {messages.map(m => <MessageBox {...m} onClose={(id) => removeMessage(id)} key={m.id} />)}
          </div>}
      <RouterProvider router={router} />
  </MessageBoxContext.Provider>
  )
}

export default App

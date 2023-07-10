import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerFetchListener } from './events/fetchEvents.js'

registerFetchListener();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

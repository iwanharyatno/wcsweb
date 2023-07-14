import { createContext, useState } from "react";
import {
    FaCheckCircle,
    FaInfoCircle,
    FaExclamationTriangle,
    FaExclamationCircle,
    FaTimes
} from 'react-icons/fa'

function MessageBox({ id, message, type, onClose }) {
    const icon = iconFromType(type);
    const color = colorFromType(type);

    return (
        <div className={'z-50 w-auto flex shadow-md rounded-md items-center p-3 cursor-pointer active:scale-90 transition-transform ' + color} onClick={() => onClose(id)}>
            <div className="mr-4">{icon}</div>
            <p className="grow mr-4">{message}</p>
            <button className="hover:opacity-50" onClick={() => onClose(id)}>
                <FaTimes />
            </button>
        </div>
    )
}

function iconFromType(type) {
    let icon = <></>;

    switch (type) {
        case 'success':
            icon = <FaCheckCircle />
            break;
        case 'info':
            icon = <FaInfoCircle />
            break;
        case 'warning':
            icon = <FaExclamationTriangle />
            break;
        case 'error':
            icon = <FaExclamationCircle />
            break;
        default:
            icon = <FaInfoCircle />
    }

    return icon;
}


function colorFromType(type) {
    let color = 'text-white';

    switch (type) {
        case 'success':
            color += ' bg-green-light'
            break;
        case 'info':
            color += ' bg-blue-medium'
            break;
        case 'warning':
            color += ' bg-yellow'
            break;
        case 'error':
            color += ' bg-red-medium'
            break;
        default:
            color = 'bg-white text-black'
    }

    return color;
}

const MessageBoxContext = createContext({});

function MessageBoxContextProvider({ children }) {
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
        {children}
    </MessageBoxContext.Provider>
    )
}

export default MessageBoxContext;
export { MessageBoxContextProvider }
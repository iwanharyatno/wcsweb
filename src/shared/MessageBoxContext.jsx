import { createContext, useEffect, useRef, useState } from "react";
import {
    FaCheckCircle,
    FaInfoCircle,
    FaExclamationTriangle,
    FaExclamationCircle,
    FaTimes
} from 'react-icons/fa'

function MessageBox({ id, message, type, timer, action, onTimeout, onClose }) {
    const [countdown, setCountdown] = useState(timer);

    const icon = iconFromType(type);
    const color = colorFromType(type);

    const canceledRef = useRef(false);

    useEffect(() => {
        const countDownCallback = (value) => {
            const next = value - 1;

            if (canceledRef.current) return;
            if (next == 0) {
                if (onTimeout) onTimeout();
                onClose(id);
                return;
            }

            setCountdown(next);
            setTimeout(() => countDownCallback(next), 1000)
        }
        setTimeout(() => countDownCallback(countdown || 0), 1000);
    }, []);

    const handleAction = (e) => {
        e.stopPropagation();
        if (action) {
            action.onAction();
            canceledRef.current = true;
        }
        onClose(id);
    }

    return (
        <div className={'z-50 w-auto flex shadow-md rounded-md items-center p-3 cursor-pointer active:scale-90 transition-transform ' + color} onClick={handleAction}>
            <div className="mr-4">{timer ? countdown : icon}</div>
            <p className="grow mr-4">{message}</p>
            <button className="hover:opacity-50" onClick={handleAction}>
                {action ? action.text : <FaTimes />}
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
  
    const addMessage = (message) => {
        const updated = [...messages];
        updated.push({
            id: +new Date(),
            ...message
        });
        setMessages(updated);
    };
  
    return (
      <MessageBoxContext.Provider value={{
        showMessage: addMessage
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
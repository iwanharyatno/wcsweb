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

export default MessageBox;
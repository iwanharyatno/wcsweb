import { useState } from 'react';
import {
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';

function FormInput({ variant, size, className, type, ...rest }) {
    const [show, setShow] = useState(false);

    const variantClasses = fromVariant(variant);
    const sizeClasses = fromSize(size);

    const final = type !== 'password' ?
        <input {...rest} type={type} className={[variantClasses, sizeClasses, className].join(' ')} /> :
        (
            <div className={[className, variantClasses, "flex"].join(' ')}>
                <input {...rest} className={[sizeClasses, 'bg-transparent', 'grow'].join(' ')} type={show ? 'text' : 'password'} />
                <button type="button" className="text-gray hover:opacity-50 px-3" onClick={() => setShow(!show)}>
                    { show ? <FaEyeSlash /> : <FaEye /> }
                </button>
            </div>
        )

    return final;
}

function FormTextArea({ variant, size, className, ...rest }) {
    const classes = fromVariantAndSize(variant, size);

    return (
        <textarea {...rest} className={[classes, 'font-inherit ' + className].join(' ')}></textarea>
    )
}

function FormSelect({ variant, size, className, children, ...rest }) {
    const classes = fromVariantAndSize(variant, size);

    return (
        <select {...rest} className={[classes, className].join(' ')}>
            {children}
        </select>
    )
}

function fromVariantAndSize(variant, size) {
    const variantClass = fromVariant(variant);
    const sizeClass = fromSize(size);

    return [variantClass, sizeClass].join(' ');
}

function fromVariant(variant) {
    let result = 'bg-gray-light/50 text-black border-none focus:outline';

    switch (variant) {
        case 'outlined':
            result = 'bg-transparent text-current rounded-xl border transition-all focus:outline'
            break;
        case 'pill':
            result += ' rounded-pill'
            break;
        default:
            result += ' rounded'
            break;
    }

    return result;
}
function fromSize(size) {
    let result;

    switch (size) {
        case 'sm':
            result = 'px-2 py-1 fs-sm'; 
            break;
        case 'lg':
            result = 'px-6 py-3';
            break;
        default:
            result = 'px-4 py-2';
    }

    return result;
}

export {
    FormInput,
    FormTextArea,
    FormSelect
}
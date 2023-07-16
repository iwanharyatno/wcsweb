import { FormInput, FormSelect, FormTextArea } from "./FormInput";
import { FaPen, FaSave } from 'react-icons/fa';
import { useState } from "react";

function TextEditable({ size, value, type, className, display, label, disabled, children, onChange }) {
    const [editable, setEditable] = useState(false);
    const [oldValue, setOldValue] = useState(value);

    const onFocusEnd = (e) => {
        setEditable(false);
        const newValue = e.target.value;
        if (oldValue !== newValue && !!newValue) {
            if (onChange) onChange(newValue);
            setOldValue(newValue);
        }
    };

    const checkKey = (e) => {
        if ((e.keyCode == 13 || e.code == 'Enter') && type != 'textarea') {
            onFocusEnd(e);
        }
    }

    const renderInput = () => {
        let input = <FormInput type={type} variant="outlined" size={size} defaultValue={value} onBlur={onFocusEnd} onKeyUp={checkKey} className={className} />;

        if (type === 'select') {
            input = (
                <FormSelect defaultValue={value} variant="outlined" size={size} onBlur={onFocusEnd} onKeyUp={checkKey} className={className}>
                    {children}
                </FormSelect>
            );
        }

        if (type === 'textarea') {
            input = (
                <FormTextArea defaultValue={value} variant="outlined" size={size} onBlur={onFocusEnd} onKeyUp={checkKey} className={className} />
            );
        }

        return input;
    }

    const handleOnClick = (editable) => {
        if (editable) onFocusEnd();
        else setEditable(true);
    }

    return (
        <div className={["group flex gap-2 items-center", className].join(' ')}>
            {editable && !disabled ?
                renderInput() :
                display || <p>{type && type.includes('date') ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'long' }) : value}</p>}
            
                <button className={["text-gray text-sm xl:hidden", !disabled ? 'group-hover:block' : 'hidden cursor-none'].join(' ')} onClick={() => handleOnClick(editable)} title={editable ? `Save ${label} changes` : `Edit ${label}`} hidden={disabled}>
                    {(!editable && !disabled) ? <FaPen /> : <FaSave />}
                </button>
        </div>
    );
}

export default TextEditable;
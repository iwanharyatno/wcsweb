import { FormInput, FormSelect, FormTextArea } from "./FormInput";
import { FaPen, FaTimes } from 'react-icons/fa';
import { useState } from "react";

function TextEditable({ size, value, type, className, disabled, children, onChange }) {
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
        if (e.keyCode == 13 || e.code == 'Enter') {
            onFocusEnd(e);
        }
    }

    const renderInput = () => {
        let input = <FormInput type={type} variant="outlined" size={size} defaultValue={value} onBlur={onFocusEnd} onKeyUp={checkKey} />;

        if (type === 'select') {
            input = (
                <FormSelect defaultValue={value} variant="outlined" size={size} onBlur={onFocusEnd} onKeyUp={checkKey}>
                    {children}
                </FormSelect>
            );
        }

        if (type === 'textarea') {
            input = (
                <FormTextArea defaultValue={value} variant="outlined" size={size} onBlur={onFocusEnd} onKeyUp={checkKey} />
            );
        }

        return input;
    }

    return (
        <div className={["flex gap-2 items-center", className].join(' ')}>
            {editable && !disabled ?
                renderInput() :
                <p>{type && type.includes('date') ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'long' }) : value}</p>}
            
                <button className="text-gray text-sm" onClick={() => setEditable(!editable)}>
                    {(!editable && !disabled) ? <FaPen /> : <FaTimes />}
                </button>
        </div>
    );
}

export default TextEditable;
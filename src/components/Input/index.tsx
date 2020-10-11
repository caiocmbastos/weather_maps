import React, { InputHTMLAttributes } from 'react'

import './style.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label?: string
    type: string
    placeholder?: string
}

const Input: React.FC<InputProps> = ({name, label, placeholder, type, ...rest}) => {
    return (
        <div className="input-block">
            <label htmlFor={name}>{label}</label>
            <input type={type} name={name} id={name} placeholder={placeholder}{...rest}/>
        </div>
    )
}

export default Input
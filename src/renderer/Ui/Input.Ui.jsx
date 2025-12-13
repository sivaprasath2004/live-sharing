import React from 'react'
import "./index.css"
const InputUi = ({placeholder,value,onChange}) => {
  return (
    <div className="inputGroup">
    <input type="text"   onChange={onChange} value={value}  required autoComplete="off" />
    <label htmlFor="name">{placeholder}</label>
   </div>
  )
}

export default InputUi
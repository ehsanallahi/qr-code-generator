import React, { useState } from 'react'
import { ChromePicker } from 'react-color';

const InputColor = () => {
    const [color, setColor] =useState('#054080');
    const [displayColorPicker, setDisplayColorPicker]=useState(false);
    const handleChange = color => setColor(color.hex);
  return (
    <div>
        <label 
        className='font-semibol text-md'>
            Color
        </label>
        <div className='flex items-center gap-2'>
            <div 
            onClick={()=>setDisplayColorPicker(!displayColorPicker)}
            style={{background: color}}
            className='w-10 h-8 cursor-pointer border-4 '></div>
            <spam>{color}</spam>
        </div>
        {
            displayColorPicker && (
               <div className='absolute mt-2'>
                 <ChromePicker color={color} onChange={handleChange}/>
               </div>
            )
        }
    </div>
  )
}

export default InputColor
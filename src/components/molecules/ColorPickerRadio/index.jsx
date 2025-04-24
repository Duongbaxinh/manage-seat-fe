import React, { useState } from 'react';

const ColorPickerRadio = ({ onChangeColor }) => {

    const [color, setColor] = useState('#ffffff');

    const presetColors = [
        { name: 'Đỏ', value: '#ff0000' },
        { name: 'Xanh lá', value: '#00ff00' },
        { name: 'Xanh dương', value: '#0000ff' },
        { name: 'Vàng', value: '#ffff00' },
        { name: 'Tím', value: '#800080' },
        { name: 'Xám', value: '#b0b0b0' },
        { name: 'Cam', value: '#ffa500' },
        { name: 'Xanh ngọc', value: '#00ced1' },
        { name: 'Hồng nhạt', value: '#ffc0cb' }
    ];
    const handleColorChange = (colorValue) => {
        onChangeColor(colorValue)
        setColor(colorValue);
    };

    return (
        <div className=" flex gap-3  mx-auto">
            {presetColors.map((preset) => (
                <label key={preset.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="color"
                        value={preset.value}
                        checked={color === preset.value}
                        onChange={() => handleColorChange(preset.value)}
                        className="w-4 h-4 hidden"
                    />
                    <div

                        className={`w-4 h-4 rounded-full  transition-transform hover:scale-110`}
                        style={{
                            backgroundColor: preset.value,
                            border: color === preset.value ? "2px solid blue" : ""
                        }}
                    ></div>
                </label>
            ))}
        </div>
    );
};

export default ColorPickerRadio;
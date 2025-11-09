import React from 'react';

export default function Digit({ digitIndex, digits }){
    const src = digits[digitIndex] || digits[0];
    return <img src={src} alt={String(digitIndex)} className="digit" />;
}
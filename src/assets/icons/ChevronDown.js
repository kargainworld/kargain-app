import React from 'react';

const ChevronDown = (props) => {
  return (
    <svg width={16} height={17} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4.011 6.395l3.875 3.875 3.875-3.875"
        stroke="url(#prefix__paint0_linear_3014_436)"
        strokeWidth={0.861}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="prefix__paint0_linear_3014_436"
          x1={7.886}
          y1={6.395}
          x2={7.886}
          y2={10.27}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2C65F6" />
          <stop offset={0.375} stopColor="#699EF8" />
          <stop offset={0.682} stopColor="#A291F3" />
          <stop offset={1} stopColor="#A291F3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ChevronDown;

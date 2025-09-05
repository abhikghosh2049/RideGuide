import React from 'react';

export const ZekkenLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="logo-gradient-stylish" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A855F7"/>
        <stop offset="1" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#logo-gradient-stylish)"/>
    <path
      d="M42 18L22 46H42"
      stroke="white"
      strokeOpacity="0.6"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
     <path
      d="M22 18H42L22 46"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
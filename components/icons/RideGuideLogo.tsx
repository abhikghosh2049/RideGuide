import React from 'react';

export const RideGuideLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="logo-gradient-side-cab" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A855F7"/>
        <stop offset="1" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#logo-gradient-side-cab)"/>
    
    <g transform="translate(4, 2)">
      <path 
        d="M5,34.5 C5,32.5 6,31 8.5,31 H14.5 L21,23 H39 L45.5,31 H51.5 C54,31 55,32.5 55,34.5 V39.5 C55,41.5 54,43 51.5,43 H8.5 C6,43 5,41.5 5,39.5 Z"
        fill="white"
      />
      
      <circle cx="15" cy="43.5" r="5" fill="white" />
      <circle cx="45" cy="43.5" r="5" fill="white" />
      
      <circle cx="15" cy="43.5" r="2.5" fill="url(#logo-gradient-side-cab)" />
      <circle cx="45" cy="43.5" r="2.5" fill="url(#logo-gradient-side-cab)" />

      <path 
        d="M22,25 L38,25 L43.5,31 H16.5 Z"
        fill="url(#logo-gradient-side-cab)"
      />
    </g>
  </svg>
);
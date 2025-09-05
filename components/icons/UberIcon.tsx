
import React from 'react';

export const UberIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" />
    <rect x="7" y="7" width="10" height="10" rx="1.5" fill="white" />
    <rect x="11" y="7" width="2" height="10" fill="black" />
  </svg>
);

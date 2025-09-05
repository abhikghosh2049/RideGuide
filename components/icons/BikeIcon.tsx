import React from 'react';

export const BikeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18.5" cy="17.5" r="3.5" />
    <circle cx="5.5" cy="17.5" r="3.5" />
    <path d="M15 17.5h-5.5a3.5 3.5 0 0 0-3.46-3.5H3V6.5a3.5 3.5 0 0 1 3.5-3.5H14a2 2 0 0 1 2 2v1.5h1.5a3.5 3.5 0 0 1 3.5 3.5V14" />
    <path d="M12 8h-5" />
  </svg>
);
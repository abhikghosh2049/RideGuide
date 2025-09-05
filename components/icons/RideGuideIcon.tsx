import React from 'react';

export const RideGuideIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
        <svg
            {...props}
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path 
              d="M2 15.5C2 14.4 2.5 14 4 14H6L9 10H15L18 14H20C21.5 14 22 14.4 22 15.5V17.5C22 18.6 21.5 19 20 19H4C2.5 19 2 18.6 2 17.5Z"
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle cx="7" cy="19" r="2" stroke="white" strokeWidth="1.5" />
            <circle cx="17" cy="19" r="2" stroke="white" strokeWidth="1.5" />
        </svg>
    </div>
);
import React from 'react';

export const ZekkenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
        <svg
            {...props}
            width="28"
            height="28"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M42 18L22 46H42"
                stroke="white"
                strokeOpacity="0.6"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M22 18H42L22 46"
                stroke="white"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </div>
);
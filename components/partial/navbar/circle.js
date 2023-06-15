import React, { useState } from 'react';
const getData = (percent) => {
  return [
    { x: 1, y: percent },
    { x: 2, y: 100 - percent }
  ];
};

export default function CircleApp({ percentCorrect }) {
  const [percent, setPercent] = useState(25);
  const data = getData(percent);
  return (
    <div className="w-12 h-12 relative">
      <div className="absolute text-[12px] t-0 l-0 text-green-400 font-black w-full h-full flex justify-center items-center">
        {percentCorrect}%
      </div>
      <svg viewBox="0 0 36 36">
        <path
          d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#EDF9EF"
          strokeWidth="4"
        />
        <g>
          <path
            fill="none"
            d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
            stroke="url(#paint0_linear_604_2179)"
            strokeWidth="4"
            strokeDasharray={`${percentCorrect}, 100`}
            style={{ strokeLinecap: 'round' }}
          />
        </g>
        <defs xmlns="http://www.w3.org/2000/svg">
          <filter
            id="filter0_di_604_2179"
            x="0.230469"
            y="0.230469"
            width="67.7695"
            height="67.7695"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="2" />
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.625 0 0 0 0 0.280449 0 0 0 0.16 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_604_2179" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_604_2179" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-2" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
            <feBlend mode="normal" in2="shape" result="effect2_innerShadow_604_2179" />
          </filter>
          <linearGradient
            id="paint0_linear_604_2179"
            x1="6.42096"
            y1="34"
            x2="51.0465"
            y2="14.7907"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#50D165" />
            <stop offset="1" stopColor="#3CBD51" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

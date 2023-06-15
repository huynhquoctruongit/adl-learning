export const ProfileIcon = ({ color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21V19C20 17.9391 19.5505 16.9217 18.7503 16.1716C17.9502 15.4214 16.8649 15 15.7333 15H8.26667C7.13508 15 6.04983 15.4214 5.24968 16.1716C4.44952 16.9217 4 17.9391 4 19V21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const FlatIcon = (props) => {
  return (
    <svg width="24" {...props} height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22V15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PaymentIcon = ({ color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 10H23" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const Logout = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const LeftIcon = ({ className }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L10.4142 12L15.7071 17.2929C16.0976 17.6834 16.0976 18.3166 15.7071 18.7071C15.3166 19.0976 14.6834 19.0976 14.2929 18.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289Z" fill="#383838" />
    </svg>
  );
};

export const BookProfile = ({ color }) => {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const HistoryPayment = ({ color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 17H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9H9H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const TickProfile = ({ className }) => {
  return (
    <svg
      className={className}
      width={26}
      height={23}
      viewBox="0 0 26 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_di_3372_25242)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.6273 4.5708C20.3508 5.10492 20.5522 6.12927 20.0701 6.90191C17.2767 11.3792 14.4628 14.89 12.7848 16.8522C11.9242 17.8586 10.4721 17.9463 9.51504 17.0379C8.05001 15.6475 5.88742 13.432 3.98879 10.8426C3.50063 10.1768 3.578 9.24614 4.14093 8.64689L4.72183 8.0285C5.38521 7.32232 6.48124 7.32216 7.13971 8.03325C9.08077 10.1294 10.9597 12.2179 10.9597 12.2179C10.9597 12.2179 13.6126 8.7202 16.8969 4.55686C17.4587 3.84472 18.4583 3.70786 19.1816 4.24175L19.6273 4.5708Z"
          fill="url(#paint0_linear_3372_25242)"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_3372_25242"
          x="0.666016"
          y="0.916748"
          width="24.666"
          height="21.75"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx={1} dy={1} />
          <feGaussianBlur stdDeviation={2} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.276649 0 0 0 0 0.847958 0 0 0 0 0.272042 0 0 0 0.2 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3372_25242" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3372_25242" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx={-2} />
          <feGaussianBlur stdDeviation={1} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_3372_25242" />
        </filter>
        <linearGradient
          id="paint0_linear_3372_25242"
          x1="3.66602"
          y1="17.6667"
          x2="20.3327"
          y2="17.6667"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#57DA60" />
          <stop offset={1} stopColor="#9CEE66" />
        </linearGradient>
      </defs>
    </svg>
  );
};

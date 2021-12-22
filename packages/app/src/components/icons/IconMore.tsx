import React from 'react';

interface IconMoreProps extends React.HTMLAttributes<SVGElement> {}

const IconMore = ({ className }: IconMoreProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    width="1em"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export default IconMore;

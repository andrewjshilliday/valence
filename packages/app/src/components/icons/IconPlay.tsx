import React from 'react';

interface IconPlayProps extends React.HTMLAttributes<SVGElement> {}

const IconPlay = ({ className }: IconPlayProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    width="1em"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    className={className}
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default IconPlay;

import React from 'react';

interface IconDotsHorizontalCircleProps extends React.HTMLAttributes<SVGElement> {}

const IconDotsHorizontalCircle = ({ className }: IconDotsHorizontalCircleProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    width="1em"
    viewBox="0 0 20 20"
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    className={className}
  >
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
    />
  </svg>
);

export default IconDotsHorizontalCircle;

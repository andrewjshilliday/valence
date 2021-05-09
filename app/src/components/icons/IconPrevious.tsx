import React from 'react';

interface IconPreviousProps extends React.HTMLAttributes<SVGElement> {}

const IconPrevious = ({ className }: IconPreviousProps): JSX.Element => (
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
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

export default IconPrevious;

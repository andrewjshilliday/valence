import React from 'react';

interface IconExplicitProps extends React.HTMLAttributes<SVGElement> {}

const IconExplicit = ({ className }: IconExplicitProps): JSX.Element => (
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
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z" />
  </svg>
);

export default IconExplicit;

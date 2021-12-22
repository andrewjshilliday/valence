import React from 'react';

interface IconListProps extends React.HTMLAttributes<SVGElement> {}

const IconList = ({ className }: IconListProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    width="1em"
    viewBox="0 0 16 16"
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    className={className}
  >
    <path d="M1 12v-1h9v1H1zm0-5h14v1H1V7zm11-4v1H1V3h11z" />
  </svg>
);

export default IconList;

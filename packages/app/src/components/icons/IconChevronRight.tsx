import React from 'react';

interface IconChevronRightProps extends React.HTMLAttributes<SVGElement> {}

const IconChevronRight = ({ className }: IconChevronRightProps): JSX.Element => (
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
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M6.776 1.553a.5.5 0 01.671.223l3 6a.5.5 0 010 .448l-3 6a.5.5 0 11-.894-.448L9.44 8 6.553 2.224a.5.5 0 01.223-.671z"
    />
  </svg>
);

export default IconChevronRight;

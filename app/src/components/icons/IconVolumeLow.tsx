import React from 'react';

interface IconVolumeMuteProps extends React.HTMLAttributes<SVGElement> {}

const IconVolumeMute = ({ className }: IconVolumeMuteProps): JSX.Element => (
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
    <path d="M4,17h2.697l5.748,3.832C12.612,20.943,12.806,21,13,21c0.162,0,0.324-0.039,0.472-0.118C13.797,20.708,14,20.369,14,20V4 c0-0.369-0.203-0.708-0.528-0.882c-0.324-0.175-0.72-0.154-1.026,0.05L6.697,7H4C2.897,7,2,7.897,2,9v6C2,16.103,2.897,17,4,17z M4,9h3c0.033,0,0.061-0.016,0.093-0.019c0.064-0.006,0.125-0.02,0.188-0.038c0.067-0.021,0.13-0.045,0.191-0.078 c0.026-0.014,0.057-0.017,0.082-0.033L12,5.868v12.264l-4.445-2.964c-0.025-0.018-0.056-0.02-0.082-0.033 c-0.061-0.033-0.122-0.058-0.189-0.078c-0.064-0.019-0.127-0.032-0.193-0.038C7.059,15.016,7.032,15,7,15H4V9z" />
  </svg>
);

export default IconVolumeMute;
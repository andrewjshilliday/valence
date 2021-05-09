import React from 'react';

interface IconPlaylistProps extends React.HTMLAttributes<SVGElement> {}

const IconPlaylist = ({ className }: IconPlaylistProps): JSX.Element => (
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
    <g>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M2 18h10v2H2v-2zm0-7h14v2H2v-2zm0-7h20v2H2V4zm17 11.17V9h5v2h-3v7a3 3 0 1 1-2-2.83z" />
    </g>
  </svg>
);

export default IconPlaylist;

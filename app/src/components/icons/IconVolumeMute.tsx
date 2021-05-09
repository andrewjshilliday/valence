import React from 'react';

interface IconVolumeLowProps extends React.HTMLAttributes<SVGElement> {}

const IconVolumeLow = ({ className }: IconVolumeLowProps): JSX.Element => (
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
    <path d="M4 17h2.697l5.748 3.832C12.612 20.943 12.806 21 13 21c.162 0 .324-.039.472-.118C13.797 20.708 14 20.369 14 20V4c0-.369-.203-.708-.528-.882-.324-.174-.72-.154-1.026.05L6.697 7H4C2.897 7 2 7.897 2 9v6C2 16.103 2.897 17 4 17zM4 9h3c.033 0 .061-.016.093-.019.064-.006.125-.02.188-.038.067-.021.13-.045.191-.078.026-.014.057-.017.082-.033L12 5.868v12.264l-4.445-2.964c-.025-.018-.056-.02-.082-.033-.061-.033-.122-.058-.189-.078-.064-.019-.127-.032-.193-.038C7.059 15.016 7.032 15 7 15H4V9zM16 7v10c1.225-1.1 2-3.229 2-5S17.225 8.1 16 7z" />
  </svg>
);

export default IconVolumeLow;

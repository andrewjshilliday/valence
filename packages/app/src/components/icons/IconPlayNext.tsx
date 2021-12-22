import React from 'react';

interface IconPlayNextProps extends React.HTMLAttributes<SVGElement> {}

const IconPlayNext = ({ className }: IconPlayNextProps): JSX.Element => (
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
    <path d="M9.765 2.567a.776.776 0 0 1-.783-.784c0-.438.344-.783.783-.783h5.452c.438 0 .783.345.783.783a.776.776 0 0 1-.783.784H9.765zM5.285 6.43c-.533.428-1.233.167-1.233-.533v-.752H2.527c-.23 0-.334.126-.334.334V6.62c0 .783-.397 1.274-1.096 1.274-.7 0-1.097-.49-1.097-1.274v-1.42c0-1.4.982-2.246 2.381-2.246h1.671V2.18c0-.73.68-.992 1.233-.543l2.329 1.89a.636.636 0 0 1 0 1.024l-2.33 1.88zm4.48.428a.776.776 0 0 1-.783-.783c0-.439.344-.784.783-.784h5.452c.438 0 .783.345.783.784a.776.776 0 0 1-.783.783H9.765zM.783 11.151A.776.776 0 0 1 0 10.368c0-.438.345-.783.783-.783h14.434c.438 0 .783.345.783.783a.776.776 0 0 1-.783.783H.783zm0 4.293A.776.776 0 0 1 0 14.66c0-.44.345-.784.783-.784h14.434c.438 0 .783.345.783.784a.776.776 0 0 1-.783.783H.783z" />
  </svg>
);

export default IconPlayNext;

import React from 'react';

interface IconPlayLaterProps extends React.HTMLAttributes<SVGElement> {}

const IconPlayLater = ({ className }: IconPlayLaterProps): JSX.Element => (
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
    <path d="M.783 1h14.434c.438 0 .783.345.783.783a.776.776 0 0 1-.783.784H.783A.776.776 0 0 1 0 1.783C0 1.345.345 1 .783 1zm0 4.292h14.434c.438 0 .783.345.783.784a.776.776 0 0 1-.783.783H.783A.776.776 0 0 1 0 6.076c0-.439.345-.784.783-.784zm4.502 4.721l2.329 1.88a.636.636 0 0 1 0 1.023l-2.33 1.89c-.553.45-1.232.189-1.232-.542v-.773h-1.67C.981 13.49 0 12.645 0 11.245v-1.42c0-.783.397-1.274 1.097-1.274s1.096.49 1.096 1.274v1.138c0 .21.105.335.334.335h1.525v-.752c0-.7.7-.961 1.233-.533zm4.48-.428h5.452c.438 0 .783.345.783.783a.776.776 0 0 1-.783.783H9.765a.776.776 0 0 1-.783-.783c0-.438.344-.783.783-.783zm0 4.292h5.452c.438 0 .783.345.783.784a.776.776 0 0 1-.783.783H9.765a.776.776 0 0 1-.783-.783c0-.44.344-.784.783-.784z" />
  </svg>
);

export default IconPlayLater;

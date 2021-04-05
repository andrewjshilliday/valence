import React from 'react';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer = ({ className }: FooterProps): JSX.Element => (
  <footer className={className}>
    <h1>Footer</h1>
  </footer>
);

export default Footer;

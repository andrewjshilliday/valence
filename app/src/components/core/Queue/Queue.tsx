import React from 'react';

interface QueueProps extends React.HTMLAttributes<HTMLDivElement> {}

const Queue = ({ className }: QueueProps): JSX.Element => {
  return (
    <div className={className}>
      <h1>Header</h1>
    </div>
  );
};

export default Queue;

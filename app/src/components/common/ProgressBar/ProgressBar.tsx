import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  bufferedPercent?: number;
  current: number;
  max: number;
  /* onChange?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, v: number) => any | undefined; */
  onChangeCommit?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, v: number) => any;
  vertical?: boolean;
};

const ProgressBar = ({
  bufferedPercent,
  className,
  current,
  max,
  onChangeCommit,
  vertical = false
}: ProgressBarProps): JSX.Element => {
  const [currentPercent, setCurrentPercent] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(0);
  const [scrubbingValue, setScrubbingValue] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPercent(current / max);

    let scrubberPosition = !vertical
      ? Math.floor((progressBarRef.current?.clientWidth ?? 0) * (current / max)) - 2
      : Math.floor((progressBarRef.current?.clientHeight ?? 0) * ((max - current) / max)) - 2;

    if (scrubberPosition < 0) {
      scrubberPosition = 0;
    }

    setScrubberPosition(scrubberPosition);
  }, [current]);

  useEffect(() => {
    if (isScrubbing) {
      document.addEventListener('mousemove', handleMouseMove);
      /* document.addEventListener('mouseup', handleMouseUpScrubbing); */
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      /* document.removeEventListener('mouseup', handleMouseUpScrubbing); */
    };
  }, [isScrubbing]);

  const getChangeValue = (pageSize: number): number | null => {
    if (!progressBarRef.current) {
      return null;
    }

    const progressBarSize = !vertical ? progressBarRef.current.clientWidth : progressBarRef.current.clientHeight;

    let clickPercent = 0;
    let clickValue = 0;
    if (!vertical) {
      clickPercent = (pageSize - progressBarRef.current.getBoundingClientRect().x) / progressBarSize;
      clickValue = Math.floor(max * clickPercent);
    } else {
      clickPercent = (pageSize - progressBarRef.current.getBoundingClientRect().y) / progressBarSize;
      clickValue = max - Math.floor(max * clickPercent);
    }

    if (bufferedPercent != null && bufferedPercent < clickPercent * 100) {
      return null;
    }

    return clickValue;
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log('test');
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!progressBarRef.current || !onChangeCommit || event.button !== 0) {
      return;
    }

    const changeValue = getChangeValue(!vertical ? event.pageX : event.pageY);

    if (changeValue == null) {
      return;
    }

    onChangeCommit(event, changeValue);

    /* const progressBarSize = !vertical ? progressBarRef.current.clientWidth : progressBarRef.current.clientHeight;

    let clickPercent = 0;
    let clickValue = 0;
    if (!vertical) {
      clickPercent = (event.pageX - progressBarRef.current.getBoundingClientRect().x) / progressBarSize;
      clickValue = Math.floor(max * clickPercent);
    } else {
      clickPercent = ( - progressBarRef.current.getBoundingClientRect().y) / progressBarSize;
      clickValue = max - Math.floor(max * clickPercent);
    }

    onChangeCommit(event, clickValue); */
  };

  const handleMouseDown = () => {
    setIsScrubbing(true);
  };

  const handleMouseUpScrubbing = () => {
    setIsScrubbing(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!progressBarRef.current || event.button !== 0) {
      return;
    }

    let value = event.clientX - progressBarRef.current.getBoundingClientRect().left;
    if (value < 0) {
      value = 0;
    }
    if (value > progressBarRef.current.offsetWidth) {
      value = progressBarRef.current.offsetWidth;
    }
    console.log(value);
  };

  return (
    <>
      <StyledContainer
        ref={progressBarRef}
        className={className}
        currentPercent={currentPercent}
        bufferedPercent={bufferedPercent}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        vertical={vertical}
      />
      <StyledScrubber offset={scrubberPosition ?? 0} vertical={vertical} />
    </>
  );
};

const StyledContainer = styled.div<{
  currentPercent: number;
  bufferedPercent?: number;
  vertical: boolean;
}>`
  width: ${({ vertical }) => (!vertical ? `100%` : `6px`)};
  height: ${({ vertical }) => (!vertical ? `6px` : `100%`)};
  border-radius: 3px;
  background: ${({ bufferedPercent, currentPercent, vertical }) =>
    bufferedPercent == null
      ? `linear-gradient(
        to ${!vertical ? 'right' : 'top'},
        red ${currentPercent * 100}%,
        gray ${currentPercent * 100}%
      )`
      : `linear-gradient(
        to ${!vertical ? 'right' : 'top'},
        red 0,
        red ${currentPercent * 100}%,
        gray ${currentPercent * 100}%,
        gray ${bufferedPercent}%,
        dimgray ${bufferedPercent}%,
        dimgray 100%
      )`};
`;

const StyledScrubber = styled.div<{ offset: number; vertical: boolean }>`
  position: absolute;
  ${({ offset, vertical }) =>
    !vertical
      ? `
        top: -5px;
        left: ${offset}px;
        height: 1rem;
        width: 5px;
      `
      : `
        top: ${offset}px;
        left: -5px;
        height: 5px;
        width: 1rem;
      `};
  border-radius: 1rem;
  background: red;
`;

export default ProgressBar;

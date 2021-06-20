import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  bufferedPercent?: number;
  current: number;
  max: number;
  /* onChange?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, v: number) => any | undefined; */
  onChangeCommit?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, v: number) => any;
  orient?: Orient;
}

type Orient = 'horizontal' | 'vertical';

const Slider = ({
  bufferedPercent,
  className,
  current,
  max,
  onChangeCommit,
  orient = 'horizontal'
}: SliderProps): JSX.Element => {
  const [currentPercent, setCurrentPercent] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentPercent(current / max);
  }, [current]);

  /* useLayoutEffect(() => {
    if (!inputRef.current) {
      return;
    }
  
    inputRef.current.setAttribute('orient', orient);
  }); */

  return (
    <>
      <StyledInput
        ref={inputRef}
        type={'range'}
        min={0}
        max={max}
        value={current}
        onChange={() => null}
        orient={orient}
        currentPercent={currentPercent}
      />
    </>
  );
};

export default Slider;

const StyledInput = styled.input<{
  currentPercent: number;
  bufferedPercent?: number;
  orient: Orient;
}>`
  -webkit-appearance: none;
  background: transparent;
  width: 100%;

  ::-webkit-slider-thumb {
    /* -webkit-appearance: none;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic *
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! * */
    border-radius: 1rem;
    background: red;
    border: none;
    ${({ orient }) =>
      orient === 'horizontal'
        ? `
          height: 1rem;
          width: 6px;
        `
        : `
          height: 6px;
          width: 1rem;
        `};
  }

  ::-moz-range-thumb {
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer; */
    border-radius: 1rem;
    background: red;
    border: none;
    ${({ orient }) =>
      orient === 'horizontal'
        ? `
          height: 1rem;
          width: 6px;
        `
        : `
          height: 6px;
          width: 1rem;
        `};
  }

  ::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    border-radius: 2rem;
    background-image: ${({ bufferedPercent, currentPercent, orient }) =>
      bufferedPercent == null
        ? `linear-gradient(
          to ${orient === 'horizontal' ? 'right' : 'top'},
          red ${currentPercent * 100}%,
          gray ${currentPercent * 100}%
        )`
        : `linear-gradient(
          to ${orient === 'horizontal' ? 'right' : 'top'},
          red 0,
          red ${currentPercent * 100}%,
          gray ${currentPercent * 100}%,
          gray ${bufferedPercent}%,
          dimgray ${bufferedPercent}%,
          dimgray 100%
        )`};
  }

  ::-moz-range-track {
    width: 100%;
    height: 6px;
    border-radius: 2rem;
    background-image: ${({ bufferedPercent, currentPercent, orient }) =>
      bufferedPercent == null
        ? `linear-gradient(
          to ${orient === 'horizontal' ? 'right' : 'top'},
          red ${currentPercent * 100}%,
          gray ${currentPercent * 100}%
        )`
        : `linear-gradient(
          to ${orient === 'horizontal' ? 'right' : 'top'},
          red 0,
          red ${currentPercent * 100}%,
          gray ${currentPercent * 100}%,
          gray ${bufferedPercent}%,
          dimgray ${bufferedPercent}%,
          dimgray 100%
        )`};
  }
`;

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

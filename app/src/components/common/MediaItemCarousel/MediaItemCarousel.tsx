import React, { useEffect, createRef } from 'react';
import styled from 'styled-components';
import { MediaItemCard } from '../../common';
import { IconChevronLeft, IconChevronRight } from '../../icons';
import arrow from '../../../assets/images/arrow.svg';

type MediaItemCarouselProps = {
  items: MusicKit.MediaItem[];
  title?: string;
};

type ScrollDirection = 'left' | 'right';

const MediaItemCarousel = ({ items, title }: MediaItemCarouselProps): JSX.Element => {
  const rowRef = createRef<HTMLDivElement>();
  const leftIconRef = createRef<HTMLDivElement>();
  const rightIconRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!leftIconRef.current || !rightIconRef.current) {
      return;
    }
    leftDisabled() ? leftIconRef.current!.classList.add('disabled') : leftIconRef.current!.classList.remove('disabled');
    rightDisabled()
      ? rightIconRef.current!.classList.add('disabled')
      : rightIconRef.current!.classList.remove('disabled');
  }, [items, leftIconRef, rightIconRef]);

  const scroll = (scrollDirection: ScrollDirection) => {
    if (scrollDirection === 'right') {
      rightIconRef.current!.classList.add('disabled');
      leftIconRef.current!.classList.remove('disabled');
      rowRef.current!.scrollLeft += rowRef.current!.offsetWidth;
    } else {
      leftIconRef.current!.classList.add('disabled');
      rightIconRef.current!.classList.remove('disabled');
      rowRef.current!.scrollLeft -= rowRef.current!.offsetWidth;
    }

    setTimeout(() => {
      if (scrollDirection === 'right' && !rightDisabled()) {
        rightIconRef.current!.classList.remove('disabled');
      } else if (scrollDirection === 'left' && !leftDisabled()) {
        leftIconRef.current!.classList.remove('disabled');
      }
    }, 600);
  };

  const leftDisabled = () => {
    return rowRef.current?.scrollLeft === 0;
  };

  const rightDisabled = () => {
    return (
      (rowRef.current?.lastChild as HTMLElement)?.offsetLeft < rowRef.current!.scrollLeft + rowRef.current!.offsetWidth
    );
  };

  return (
    <CarouselContainer>
      {title && <h2>{title}</h2>}
      <MediaItemsContainer>
        <StyledBack ref={leftIconRef} onClick={() => scroll('left')}></StyledBack>
        <MediaItemCollection ref={rowRef}>
          {
            items.length && items.every((item: MusicKit.MediaItem) => item.attributes) ? (
              items.map((item: MusicKit.MediaItem) => <MediaItemCard key={item.id} item={item}></MediaItemCard>)
            ) : (
              <div />
            )
            /* Array.from(new Array(5)).map((_, i) => (
              <Box key={i} width="16.667%" style={{ margin: '0 10px', borderRadius: '0.5em' }}>
                <Skeleton variant="rect" width="100%" style={{ paddingBottom: '100%', marginBottom: 4, borderRadius: '0.5em' }} />
                <Skeleton variant="rect" width="100%" height={20} style={{ marginBottom: 4, borderRadius: '0.5em' }} />
                <Skeleton variant="rect" width="100%" height={20} style={{ borderRadius: '0.5em' }} />
              </Box>
            )) */
          }
        </MediaItemCollection>
        <StyledForward ref={rightIconRef} onClick={() => scroll('right')}></StyledForward>
      </MediaItemsContainer>
    </CarouselContainer>
  );
};

export default MediaItemCarousel;

const CarouselContainer = styled.div`
  h2 {
    margin-left: 45px;
    margin-bottom: 10px;
  }
`;
const MediaItemsContainer = styled.div`
  display: flex;
  width: 100%;
`;
const StyledBack = styled.div`
  display: inline-block;
  width: 35px;

  &::before {
    content: '';
    width: 25px;
    height: 56px;
    position: relative;
    top: 30%;
    float: left;
    background-color: white;
    mask: url(${arrow}) no-repeat center;
  }

  &:hover {
    cursor: pointer;
    &::before {
      background-color: white;
    }
  }
`;
const StyledForward = styled(StyledBack)`
  &::before {
    float: right;
    transform: rotate(180deg);
  }
`;
const MediaItemCollection = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  overflow: hidden;
  scroll-behavior: smooth;
  width: calc(100% - 10px);
  margin: 0;
  padding-bottom: 15px;
`;

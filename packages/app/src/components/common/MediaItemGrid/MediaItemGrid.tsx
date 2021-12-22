import React, { useEffect, createRef } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { LazyLoadImage } from '../../common';
import arrow from '../../../assets/images/arrow.svg';

type MediaItemGridProps = {
  items: MusicKit.MediaItem[];
  showArtwork?: boolean;
  showArtist?: boolean;
  title?: string;
};

type ScrollDirection = 'left' | 'right';

const MediaItemGrid = ({
  items,
  showArtwork,
  showArtist,
  title
}: MediaItemGridProps): JSX.Element => {
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
    <StyledGridContainer>
      {title && <h2>{title}</h2>}
      <StyledMediaItemContainer>
        <StyledLeftIcon ref={leftIconRef} onClick={() => scroll('left')} />
        <StyledMediaItemCollctions ref={rowRef} count={Math.ceil(items.length / 3)}>
          {items.map((item: MusicKit.MediaItem) => (
            <StyledMediaItem key={item.id}>
              <StyledControl>
                <i className="fas fa-plus"></i>
                {showArtwork && <LazyLoadImage alt={item.attributes.name} artwork={item.attributes.artwork} />}
              </StyledControl>
              <StyledItemDetails>
                <StyledItemName showArtist={showArtist} className="text-truncate">
                  {item.attributes.name}
                </StyledItemName>
                <StyledMoreDetail className="text-truncate">
                  {showArtist ? (
                    <>
                      {item.relationships?.artists?.data.length > 0 ? (
                        <Link to={`/artist/${item.relationships.artists.data[0].id}`}>
                          {item.attributes.artistName}
                        </Link>
                      ) : (
                        item.attributes.artistName
                      )}
                      {' '}·{' '}
                      {item.relationships?.albums?.data.length > 0 ? (
                        <Link to={`/album/${item.relationships.albums.data[0].id}`}>
                          {item.attributes.albumName}
                        </Link>
                      ) : (
                        item.attributes.albumName
                      )}
                    </>
                  ) : (
                    <>{item.attributes.albumName}</>
                  )}
                </StyledMoreDetail>
              </StyledItemDetails>
              <StyledDuration>{moment.utc(item.attributes.durationInMillis).format('m:ss')}</StyledDuration>
              <StyledContext />
            </StyledMediaItem>
          ))}
        </StyledMediaItemCollctions>
        <StyledRightIcon ref={rightIconRef} onClick={() => scroll('right')} />
      </StyledMediaItemContainer>
    </StyledGridContainer>
  );
};

export default MediaItemGrid;

const StyledGridContainer = styled.div`
  h2 {
    margin-left: 45px;
    margin-bottom: 10px;
  }
`;

const StyledMediaItemContainer = styled.div`
  display: flex;
`;

const StyledMediaItemCollctions = styled.div<{ count: number }>`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.count}, 33.333%)`};
  grid-template-rows: 33% 33% 33%;
  grid-auto-flow: column;
  width: 100%;
  overflow-x: hidden;
  scroll-behavior: smooth;
`;

const StyledMediaItem = styled.div`
  display: grid;
  grid-template-columns: 60px auto 50px 30px;
  grid-template-rows: 60px;
  grid-template-areas: 'control item-details duration context';
  align-items: center;
  border-radius: 0.5em;
  padding: 5px 10px;

  &:hover {
    background-color: var(--background-darker);
  }
`;

const StyledControl = styled.div`
  position: relative;
  grid-area: control;
  justify-content: center;
  width: 50px;
  height: 50px;

  &:hover {
    cursor: pointer;
    color: var(--primary);
  }
`;

const StyledItemDetails = styled.div`
  grid-area: item-details;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    'top'
    'bottom';
`;

const StyledItemName = styled.span<{ showArtist?: boolean; showAlbum?: boolean }>`
  grid-area: top;
`;

const StyledMoreDetail = styled.span`
  grid-area: bottom;
  font-size: 0.75em;
  opacity: 0.75;
`;

const StyledDuration = styled.span`
  grid-area: duration;
  text-align: right;
`;

const StyledContext = styled.div`
  grid-area: context;
`;

const StyledLeftIcon = styled.div`
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

const StyledRightIcon = styled(StyledLeftIcon)`
  &::before {
    float: right;
    transform: rotate(180deg);
  }
`;

import React, { useEffect, createRef } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MusicKitService } from '../../../services';
import arrow from '../../../assets/images/arrow.svg';

type MediaItemGridProps = {
  items: MusicKit.MediaItem[];
  showArtwork?: boolean;
  showArtist?: boolean;
  showAlbum?: boolean;
  title?: string;
};

type ScrollDirection = 'left' | 'right';

const MediaItemGrid = ({ items, showArtwork, showArtist, showAlbum, title }: MediaItemGridProps): JSX.Element => {
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
            <MediaItem key={item.id}>
              <StyledControl>
                <i className="fas fa-plus"></i>
                {showArtwork && (
                  <StyledImage
                    src={MusicKitService.FormatArtwork(item.attributes.artwork, 44)}
                    alt={item.attributes.name}
                  />
                )}
              </StyledControl>
              <StyledItemName showArtist={showArtist} showAlbum={showAlbum} className="text-truncate">
                {item.attributes.name}
              </StyledItemName>
              {showArtist && (
                <StyledArtistName className="text-truncate">{item.attributes.artistName}</StyledArtistName>
              )}
              {showAlbum && <StyledAlbumName className="text-truncate">{item.attributes.albumName}</StyledAlbumName>}
              <StyledDuration>{moment.utc(item.attributes.durationInMillis).format('m:ss')}</StyledDuration>
            </MediaItem>
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
  margin: 0 17px;
  scroll-behavior: smooth;
`;

const MediaItem = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  border-radius: 0.5em;
  padding: 5px 10px;
  &:hover {
    background-color: var(--background-darker);
  }
`;

const StyledControl = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 50px;
  height: 50px;
  &:hover {
    cursor: pointer;
    color: var(--primary);
  }
`;

const StyledImage = styled(LazyLoadImage)`
  position: absolute;
  max-width: 100%;
  height: auto;
  border-radius: 0.2rem;
  position: absolute;
  top: 0;
`;

const StyledItemName = styled.span<{ showArtist?: boolean; showAlbum?: boolean }>`
  ${({ showArtist, showAlbum }) => {
    if (showArtist && showAlbum) {
      return `
        max-width: calc(100% - 450px);
        width: 50%;
      `;
    } else if (showArtist && !showAlbum) {
      return `
        max-width: calc(100% - 280px);
        width: 75%;
      `;
    } else if (!showArtist && showAlbum) {
      return `
        max-width: calc(100% - 280px);
        width: 75%;
      `;
    } else {
      return `
        max-width: calc(100% - 110px);
        width: calc(100% - 110px);
      `;
    }
  }}
`;

const StyledArtistName = styled.span`
  width: 25%;
  max-width: 170px;
  min-width: 90px;
`;

const StyledAlbumName = styled.span`
  width: 25%;
  max-width: 170px;
  min-width: 90px;
`;

const StyledDuration = styled.span`
  width: 60px;
  text-align: right;
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

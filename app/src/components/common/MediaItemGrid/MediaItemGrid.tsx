import React, { useEffect, createRef } from 'react';
import moment from 'moment';
import styled from 'styled-components';
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
        <LeftIcon ref={leftIconRef} onClick={() => scroll('left')} />
        <StyledMediaItemCollctions ref={rowRef} count={Math.ceil(items.length / 3)}>
          {items.map((item: MusicKit.MediaItem) => (
            <MediaItem key={item.id}>
              <Control>
                <i className="fas fa-plus"></i>
              </Control>
              {showArtwork && (
                <img
                  src={MusicKitService.FormatArtwork(item.attributes.artwork, 44)}
                  className="img-fluid rounded"
                  alt={item.attributes.name}
                />
              )}
              <ItemName showArtist={showArtist} showAlbum={showAlbum} className="text-truncate">
                {item.attributes.name}
              </ItemName>
              {showArtist && <ArtistName className="text-truncate">{item.attributes.artistName}</ArtistName>}
              {showAlbum && <AlbumName className="track-album text-truncate">{item.attributes.albumName}</AlbumName>}
              <Duration className="track-duration">{moment.utc(item.attributes.durationInMillis).format('m:ss')}</Duration>
            </MediaItem>
          ))}
        </StyledMediaItemCollctions>
        <RightIcon ref={rightIconRef} onClick={() => scroll('right')} />
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
  grid-template-columns: ${props => `repeat(${props.count}, 33.333%)`};
  grid-template-rows: 33% 33% 33%;
  grid-auto-flow: column;
  overflow-x: hidden;
  margin: 0 17px;
  scroll-behavior: smooth;
`;

const MediaItem = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  border-radius: 0.5em;
  padding: 5px 10px;
  &:hover {
    background-color: var(--background-darker);
  }
`;

const Control = styled.div`
  display: flex;
  justify-content: center;
  width: 50px;
  &:hover {
    cursor: pointer;
    color: var(--primary);
  }
`;

const ItemName = styled.span<{ showArtist?: boolean; showAlbum?: boolean }>`
  ${(props) =>
    props.showArtist &&
    props.showAlbum &&
    `
    max-width: calc(100% - 450px);
    width: 50%;
  `}
  ${(props) =>
    props.showArtist &&
    !props.showAlbum &&
    `
    max-width: calc(100% - 280px);
    width: 75%;
  `}
  ${(props) =>
    !props.showArtist &&
    props.showAlbum &&
    `
    max-width: calc(100% - 280px);
    width: 75%;
  `}
  ${(props) =>
    !props.showArtist &&
    !props.showAlbum &&
    `
    max-width: calc(100% - 110px);
    width: calc(100% - 110px);
  `}
`;

const ArtistName = styled.span`
  width: 25%;
  max-width: 170px;
  min-width: 90px;
`;

const AlbumName = styled.span`
  width: 25%;
  max-width: 170px;
  min-width: 90px;
`;

const Duration = styled.span`
  width: 60px;
  text-align: right;
`;

const LeftIcon = styled.div`
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

const RightIcon = styled(LeftIcon)`
  &::before {
    float: right;
    transform: rotate(180deg);
  }
`;

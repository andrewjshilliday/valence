import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { ContextMenu, IconButton, LazyLoadImage } from '../../common';
import { IconDotsHorizontalCirlce, IconHeartFull, IconPlay, IconPlayLater, IconPlayNext, IconShuffle } from '../../icons';

type MediaItemCardProps = {
  item: MusicKit.MediaItem;
};

const MediaItemCard = ({ item }: MediaItemCardProps): JSX.Element => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  const contextMenu = (
    <ContextMenu
      trigger={<StyledContextButton contextMenuOpen={contextMenuOpen} />}
      triggerPositioningStyles={ContextButtonPositioning}
      onOpen={() => setContextMenuOpen(true)}
      onClose={() => setContextMenuOpen(false)}
      options={[
        {
          content: 'Play',
          icon: <IconPlay />,
          key: 'play'
        },
        {
          content: 'Shuffle',
          icon: <IconShuffle />,
          key: 'shuffle'
        },
        {
          content: 'Play Next',
          icon: <IconPlayNext />,
          key: 'play-next'
        },
        {
          content: 'Play Later',
          icon: <IconPlayLater />,
          key: 'play-later'
        },
        {
          content: 'Love',
          icon: <IconHeartFull />,
          key: 'love'
        }
      ]}
    />
  );

  const albumTemplate = (
    <>
      {contextMenu}
      <Link to={`/album/${item.id}`}>
        <div style={{ position: 'relative' }}>
          <LazyLoadImage alt={item.attributes.name} artwork={item.attributes.artwork} />
        </div>
      </Link>
      <Link to={`/album/${item.id}`}>
        <span className="text-truncate">{item.attributes.name}</span>
      </Link>
      {item.relationships?.artists?.data.length > 0 ? (
        <Link to={`/artist/${item.relationships.artists.data[0].id}`}>
          <span className="text-truncate">{item.attributes.artistName}</span>
        </Link>
      ) : (
        <span className="text-truncate">{item.attributes.artistName}</span>
      )}
    </>
  );
  const playlistTemplate = (
    <>
      {contextMenu}
      <Link to={`/playlist/${item.id}`}>
        <LazyLoadImage alt={item.attributes.name} artwork={item.attributes.artwork} />
      </Link>
      <Link to={`/album/${item.id}`}>
        <span className="text-truncate">{item.attributes.name}</span>
      </Link>
      <span className="text-truncate">{item.attributes.curatorName}</span>
    </>
  );
  const artistTemplate = (
    <Link to={`/artist/${item.id}`}>
      <LazyLoadImage alt={item.attributes.name} artwork={item.attributes.artwork} />
      <span className="text-truncate">{item.attributes.name}</span>
    </Link>
  );

  return (
    <MediaItem>
      {item.type === 'albums' && albumTemplate}
      {item.type === 'playlists' && playlistTemplate}
      {item.type === 'artists' && artistTemplate}
    </MediaItem>
  );
};

export default MediaItemCard;

const StyledContextButton = styled(IconDotsHorizontalCirlce)<{ contextMenuOpen: boolean }>`
  opacity: ${({ contextMenuOpen }) => (contextMenuOpen ? 1 : 0)};
  transition: opacity 100ms ease-in-out;
  height: 2.25rem;
  width: 2.25rem;
`;

const MediaItem = styled.div`
  position: relative;
  padding: 0 10px;
  span {
    display: block;
  }

  @media (min-width: 1200px) {
    flex: 0 0 16.666667%;
    max-width: 16.666667%;
    &.large {
      flex: 0 0 25%;
      max-width: 25%;
    }
  }
  @media (min-width: 992px) and (max-width: 1199px) {
    flex: 0 0 20%;
    max-width: 20%;
    &.large {
      flex: 0 0 25%;
      max-width: 25%;
    }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    flex: 0 0 25%;
    max-width: 25%;
    &.large {
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
    }
  }
  @media (min-width: 607px) and (max-width: 767px) {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    &.large {
      flex: 0 0 50%;
      max-width: 50%;
    }
  }
  @media (max-width: 606px) {
    flex: 0 0 50%;
    max-width: 50%;
    &.large {
      flex: 0 0 50%;
      max-width: 50%;
    }
  }

  :hover ${StyledContextButton} {
    opacity: 1;
  }
`;

const ContextButtonPositioning = css`
  position: absolute;
  bottom: 50px;
  right: 20px;
  z-index: 10;
`;

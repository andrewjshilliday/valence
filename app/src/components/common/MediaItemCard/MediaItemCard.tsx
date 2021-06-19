import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MusicKitService } from '../../../services';
import placeholder from '../../../assets/images/placeholder.jpeg';

type MediaItemCardProps = {
  item: MusicKit.MediaItem;
};

const MediaItemCard = ({ item }: MediaItemCardProps): JSX.Element => {
  const albumTemplate = (
    <>
      <Link to={`/album/${item.id}`}>
        <StyledImageContainer>
          <StyledImage
            src={item.attributes.artwork ? MusicKitService.FormatArtwork(item.attributes.artwork, 500) : placeholder}
            placeholder={<StyledPlaceholder src={placeholder} alt={item.attributes.name} />}
            alt={item.attributes.name}
          />
        </StyledImageContainer>
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
      <Link to={`/playlist/${item.id}`}>
        <StyledImageContainer>
          <StyledImage
            src={item.attributes.artwork ? MusicKitService.FormatArtwork(item.attributes.artwork, 500) : placeholder}
            placeholder={<StyledPlaceholder src={placeholder} alt={item.attributes.name} />}
            alt={item.attributes.name}
          />
        </StyledImageContainer>
        <span className="text-truncate">{item.attributes.name}</span>
      </Link>
      <span className="text-truncate">{item.attributes.curatorName}</span>
    </>
  );
  const artistTemplate = (
    <>
      <Link to={`/artist/${item.id}`}>
        <StyledImageContainer>
          <StyledImage
            src={item.attributes.artwork ? MusicKitService.FormatArtwork(item.attributes.artwork, 500) : placeholder}
            placeholder={<StyledPlaceholder src={placeholder} alt={item.attributes.name} />}
            alt={item.attributes.name}
          />
        </StyledImageContainer>
        <span className="text-truncate">{item.attributes.name}</span>
      </Link>
    </>
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

const MediaItem = styled.div`
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
`;

const StyledImageContainer = styled.div`
  position: relative;
  height: 0;
  padding-top: 100%;
`;

const StyledImage = styled(LazyLoadImage)`
  max-width: 100%;
  height: auto;
  border-radius: 0.5em;
  position: absolute;
  top: 0;
`;

const StyledPlaceholder = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 0.5em;
  position: absolute;
  top: 0;
`;

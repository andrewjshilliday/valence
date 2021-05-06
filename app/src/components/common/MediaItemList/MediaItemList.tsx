import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { useMusicKit } from '../../../components/providers';
import { MusicKitService } from '../../../services';

type MediaItemListProps = {
  collection: MusicKit.MediaItem;
  items: MusicKit.MediaItem[];
  showArtwork?: boolean;
  showArtist?: boolean;
  showAlbum?: boolean;
};

const MediaItemList = ({ collection, items, showArtwork, showArtist, showAlbum }: MediaItemListProps): JSX.Element => {
  const musicKit = useMusicKit();

  return (
    <div>
      {items.map((item: MusicKit.MediaItem) => (
        <MediaItem key={item.id} onClick={() => musicKit.playItem(collection, items.indexOf(item))}>
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
    </div>
  );
};

export default MediaItemList;

const MediaItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: 0.5em;
  padding-right: 15px;
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

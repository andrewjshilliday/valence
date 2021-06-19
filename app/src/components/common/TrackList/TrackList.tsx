import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import styled, { css } from 'styled-components';
import {
  IconAdd,
  IconHeartDislike,
  IconHeartEmpty,
  IconMore,
  IconPlayLater,
  IconPlaylistAlt,
  IconPlayNext
} from '../../icons';
import { useMusicKit } from '../../providers';
import { MusicKitService } from '../../../services';
import { ContextMenu, IconButton } from '..';

type TrackListProps = {
  collection: MusicKit.MediaItem;
  showArtwork?: boolean;
  showArtist?: boolean;
  showAlbum?: boolean;
};

const TrackList = ({ collection, showArtwork, showArtist, showAlbum }: TrackListProps): JSX.Element => {
  const musicKit = useMusicKit();
  const [discs, setDiscs] = useState<number[]>([]);

  const items = useMemo(() => collection?.relationships.tracks.data, [collection]);

  useEffect(() => {
    setDiscs([...new Set<number>(items.map((track: MusicKit.MediaItem) => track.attributes.discNumber))]);
  }, [items]);

  const Track = (item: MusicKit.MediaItem, trackNumber: number) => (
    <StyledTrack key={item.id} showArtist={showArtist} showAlbum={showAlbum}>
      <StyledControl onClick={() => musicKit.playItem(collection, items.indexOf(item))}>
        {trackNumber}
        {/* <i className="fas fa-plus"></i> */}
      </StyledControl>
      {showArtwork && (
        <img
          src={MusicKitService.FormatArtwork(item.attributes.artwork, 44)}
          className="img-fluid rounded"
          alt={item.attributes.name}
        />
      )}
      <StyledTrackName className="text-truncate">{item.attributes.name}</StyledTrackName>
      {showArtist && (
        <StyledArtistName className="text-truncate">
          {item.relationships?.artists?.data.length > 0 ? (
            <Link to={`/artist/${item.relationships.artists.data[0].id}`}>{item.attributes.artistName}</Link>
          ) : (
            item.attributes.artistName
          )}
        </StyledArtistName>
      )}
      {showAlbum && (
        <StyledAlbumName className="text-truncate">
          {item.relationships?.albums?.data.length > 0 ? (
            <Link to={`/album/${item.relationships.albums.data[0].id}`}>{item.attributes.albumName}</Link>
          ) : (
            item.attributes.albumName
          )}
        </StyledAlbumName>
      )}
      <StyledDuration>{moment.utc(item.attributes.durationInMillis).format('m:ss')}</StyledDuration>
      <StyledContextMenuContainer>
        <StyledContextMenu
          options={[
            {
              content: 'Add to playlist',
              icon: <IconPlaylistAlt />,
              key: 'add-to-playlist'
            },
            {
              content: 'Add to Library',
              icon: <IconAdd />,
              key: 'add-to-library'
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
              icon: <IconHeartEmpty />,
              key: 'love'
            },
            {
              content: 'Suggest less like this',
              icon: <IconHeartDislike />,
              key: 'suggest-less'
            }
          ]}
          trigger={<StyledIconMore />}
        />
      </StyledContextMenuContainer>
    </StyledTrack>
  );

  return (
    <>
      {discs.map((discNumber: number) => (
        <div key={`disc${discNumber}`}>
          {discs.length > 1 && <strong>Disc {discNumber}</strong>}
          {items
            .filter((item: MusicKit.MediaItem) => item.attributes.discNumber === discNumber)
            .map((item: MusicKit.MediaItem, index: number) => Track(item, index + 1))}
        </div>
      ))}
    </>
  );
};

export default TrackList;

const StyledTrack = styled.div<{ showArtist?: boolean; showAlbum?: boolean }>`
  display: grid;
  ${({ showArtist, showAlbum }) => `
    grid-template-columns: ${`
      40px minmax(100px, auto) ${showArtist ? 'clamp(80px, 25%, 170px)' : ''} ${
      showAlbum ? 'clamp(80px, 25%, 170px)' : ''
    } 45px 30px
    `};
    grid-template-areas: '
      ${`control track-name ${showArtist ? ' artist-name' : ''} ${
        showAlbum ? ' album-name' : ''
      }  duration context-menu`}
    ';
  `};
  /* grid-template-columns: 40px minmax(100px, auto) clamp(80px, 25%, 170px) clamp(80px, 25%, 170px) 45px 30px;
  grid-template-areas: 'control track-name artist-name album-name duration context-menu'; */
  gap: 10px;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: 0.5em;
  &:hover {
    background-color: var(--background-darker);
  }
`;

const StyledControl = styled.div`
  grid-area: control;
  display: flex;
  justify-content: center;

  &:hover {
    cursor: pointer;
    color: var(--primary);
  }
`;

const StyledTrackName = styled.span`
  grid-area: track-name;
`;

const StyledArtistName = styled.span`
  grid-area: artist-name;
`;

const StyledAlbumName = styled.span`
  grid-area: album-name;
`;

const StyledDuration = styled.span`
  grid-area: duration;
  text-align: right;
`;

const StyledContextMenuContainer = styled.div`
  grid-area: context-menu;
  display: flex;
  justify-content: flex-end;
`;

const StyledContextMenu = styled(ContextMenu)``;

const StyledIconMore = styled(IconMore)`
  height: 1.25em;
  width: 1.25em;
`;

import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { LoadingSpinner, MediaItemCarousel } from '../../components/common';
import { MusicKitApiService } from '../../services';

type AlbumRouterProps = {
  query: string;
};

const Search = (props: RouteComponentProps<AlbumRouterProps>): JSX.Element => {
  const query = props.match.params.query.replace(/[^a-zA-Z0-9 -]/, '');

  const { isLoading, error, data: searchData } = useQuery<MusicKit.Resource>(['searchData', query], () =>
    MusicKitApiService.Search(query, undefined, 10)
  );

  const searchResults = useMemo(() => searchData, [searchData]);

  if (!searchResults || isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <SearchContainer>
      <h1>Search - {query}</h1>
      {searchResults.artists?.data.length > 0 && (
        <MediaItemCarousel items={searchResults.artists.data} title="Artists" />
      )}
      {searchResults.albums?.data.length > 0 && <MediaItemCarousel items={searchResults.albums.data} title="Albums" />}
      {searchResults.playlists?.data.length > 0 && (
        <MediaItemCarousel items={searchResults.playlists.data} title="Playlists" />
      )}
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

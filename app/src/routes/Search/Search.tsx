import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import cloneDeep from 'lodash.clonedeep';
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

  /* const { isIdle, data: searchDataRelationships } = useQuery<MusicKit.Resource>(
    ['searchDataRelationships', query],
    async () => {
      const newData = cloneDeep<MusicKit.Resource | undefined>(searchData);

      if (newData?.albums && !newData.albums?.data[0]?.relationships) {
        newData.albums.data = await MusicKitApiService.GetRelationships(newData.albums.data);
      }
      if (newData?.playlists && !newData.playlists?.data[0]?.relationships) {
        newData.playlists.data = await MusicKitApiService.GetRelationships(newData.playlists.data);
      }

      return newData;
    },
    {
      enabled: !!searchData
    }
  ); */

  // const searchResults = useMemo(() => searchDataRelationships ?? searchData, [searchDataRelationships, searchData]);
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

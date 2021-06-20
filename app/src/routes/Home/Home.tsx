import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import cloneDeep from 'lodash.clonedeep';
import { LoadingSpinner, MediaItemCarousel, MediaItemGrid } from '../../components/common';
import { MusicKitApiService } from '../../services';

type RecommendationsDataState = {
  madeForYou: MusicKit.MediaItem[];
  recentPlayed: MusicKit.MediaItem[];
  recentPlayedTracks: MusicKit.MediaItem[];
  heavyRotation: MusicKit.MediaItem[];
  newReleases: MusicKit.MediaItem[];
  stations: MusicKit.MediaItem[];
  recommendations: any[];
};

const defaultRecommendationsState: RecommendationsDataState = {
  madeForYou: [],
  recentPlayed: [],
  recentPlayedTracks: [],
  heavyRotation: [],
  newReleases: [],
  stations: [],
  recommendations: []
};

const Home = (): JSX.Element => {
  const fetchAll = async (resource: MusicKit.Resource | undefined) => {
    const data = cloneDeep<MusicKit.MediaItem[]>(resource?.data);
    let nextUrl: string = resource?.next;
    while (nextUrl) {
      const results = await MusicKitApiService.Resource(nextUrl);
      data.push(...results.data);
      nextUrl = results.next;
    }
    return data;
  };

  const { isLoading: recommendationsLoading, error: recommendationsError, data: recommendationsData } = useQuery<any>(
    `homeRecommendations`,
    () => MusicKitApiService.Recommendations()
  );
  const {
    isLoading: recentPlayedLoading,
    error: recentPlayedError,
    data: recentPlayedData
  } = useQuery<MusicKit.Resource>(`homeRecentPlayed`, () => MusicKitApiService.RecentPlayed());
  const {
    isLoading: recentPlayedTracksLoading,
    error: recentPlayedTracksError,
    data: recentPlayedTracksData
  } = useQuery<MusicKit.MediaItem[]>(`homeRecentPlayedTracks`, () => MusicKitApiService.RecentPlayedTracks());
  const {
    isLoading: heavyRotationLoading,
    error: heavyRotationError,
    data: heavyRotationData
  } = useQuery<MusicKit.Resource>(`homeHeavyRotation`, () => MusicKitApiService.HeavyRotation());

  const recommendations = useMemo(() => {
    if (!recommendationsData || !recentPlayedData || !heavyRotationData) {
      return defaultRecommendationsState;
    }

    return {
      madeForYou: recommendationsData.find((result: any) => result.attributes.title.stringForDisplay === 'Made for You')
        .relationships.contents.data,
      recentPlayed: recentPlayedData?.data,
      recentPlayedTracks: recentPlayedTracksData,
      heavyRotation: heavyRotationData?.data,
      newReleases: recommendationsData.find(
        (result: any) => result.attributes.title.stringForDisplay === 'New Releases'
      ).relationships.contents.data,
      stations: recommendationsData.find(
        (result: any) => result.attributes.title.stringForDisplay === 'Stations for You'
      ).relationships.contents.data,
      recommendations: recommendationsData
        .filter(
          (result: any) =>
            !result.attributes.isGroupRecommendation &&
            result.attributes.title.stringForDisplay !== 'Made for You' &&
            result.attributes.title.stringForDisplay !== 'New Releases' &&
            result.attributes.title.stringForDisplay !== 'Stations for You'
        )
        .map((result: any) => ({
          title: result.attributes.title.stringForDisplay,
          items: result.relationships.contents.data
        }))
    };
  }, [recommendationsData, recentPlayedData, recentPlayedTracksData, heavyRotationData]);

  if (!recommendations.madeForYou.length) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <>
      <h1>Listen Now</h1>
      {recommendations.madeForYou.length > 0 && <MediaItemCarousel items={recommendations.madeForYou} />}
      {recommendations.recentPlayed.length > 0 && (
        <MediaItemCarousel items={recommendations.recentPlayed} title="Recent Played Albums" />
      )}
      {recommendations.recentPlayedTracks?.length && (
        <MediaItemGrid items={recommendations.recentPlayedTracks} showArtwork showArtist title="Recent Played Tracks" />
      )}
      {recommendations.heavyRotation.length > 0 && (
        <MediaItemCarousel items={recommendations.heavyRotation} title="Heavy Rotation" />
      )}
      {recommendations.newReleases.length > 0 && (
        <MediaItemCarousel items={recommendations.newReleases} title="New Releases" />
      )}
      {recommendations.recommendations.map((recommendation: any) => (
        <MediaItemCarousel key={recommendation.title} items={recommendation.items} title={recommendation.title} />
      ))}
    </>
  );
};

export default Home;

const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

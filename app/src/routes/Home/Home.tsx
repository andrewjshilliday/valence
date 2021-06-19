import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import cloneDeep from 'lodash.clonedeep';
import { LoadingSpinner, MediaItemCarousel } from '../../components/common';
import { MusicKitApiService } from '../../services';

type RecommendationsDataState = {
  madeForYou: MusicKit.MediaItem[];
  recentPlayed: MusicKit.MediaItem[];
  heavyRotation: MusicKit.MediaItem[];
  newReleases: MusicKit.MediaItem[];
  stations: MusicKit.MediaItem[];
  recommendations: any[];
};

const defaultRecommendationsState: RecommendationsDataState = {
  madeForYou: [],
  recentPlayed: [],
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
    isLoading: heavyRotationLoading,
    error: heavyRotationError,
    data: heavyRotationData
  } = useQuery<MusicKit.Resource>(`homeHeavyRotation`, () => MusicKitApiService.HeavyRotation());

  /* const { isLoading: recentPlayedAllLoading, error: recentPlayedAllError, data: recentPlayedAllData } = useQuery<
    MusicKit.MediaItem[]
  >(
    `homeRecentPlayedAll`,
    async () => {
      const data = await fetchAll(recentPlayedData);
      return data;
    },
    { enabled: recentPlayedData?.data.length > 0 }
  ); */
  /* const { isLoading: heavyRotationAllLoading, error: heavyRotationAllError, data: heavyRotationAllData } = useQuery<
    MusicKit.MediaItem[]
  >(
    `homeHeavyRotationAll`,
    async () => {
      const data = await fetchAll(heavyRotationData);
      return data;
    },
    { enabled: heavyRotationData?.data.length > 0 }
  ); */

  const { isLoading: relationshipsLoading, error: relationshipsError, data: relationshipsData } = useQuery(
    `homeRecommendationsRelationships`,
    async (): Promise<{
      recommendations?: MusicKit.Resource[];
      recentPlayed: MusicKit.MediaItem[];
      heavyRotation: MusicKit.MediaItem[];
      newReleases: MusicKit.MediaItem[];
    }> => {
      /* const recommendationsRelationships = recommendations.recommendations.map((recommendation: MusicKit.Resource) =>
        MusicKitApiService.GetRelationships(recommendation.items)
      );
      const recentPlayedRelationships = MusicKitApiService.GetRelationships(recommendations.recentPlayed);
      const heavyRotationRelationships = MusicKitApiService.GetRelationships(recommendations.heavyRotation);
      const newReleasesRelationships = MusicKitApiService.GetRelationships(recommendations.newReleases);

      const results = await Promise.all([
        recentPlayedRelationships,
        heavyRotationRelationships,
        newReleasesRelationships,
        Promise.all(recommendationsRelationships)
      ]); */

      const data = {
        recentPlayed: recommendations.recentPlayed, // results[0],
        heavyRotation: recommendations.heavyRotation, // results[1],
        newReleases: recommendations.newReleases, // results[2],
        recommendations: recommendations.recommendations.map((recommendation: MusicKit.Resource, index: number) => ({
          title: recommendation.title,
          items: recommendations.recommendations[index].items // results[3][index]
        }))
      };

      return data;
    },
    {
      enabled:
        !recommendationsLoading &&
        !recentPlayedLoading &&
        !heavyRotationLoading /* &&
        !recentPlayedAllLoading &&
        !heavyRotationAllLoading */
    }
  );

  const recommendations = useMemo(() => {
    if (!recommendationsData || !recentPlayedData || !heavyRotationData) {
      return defaultRecommendationsState;
    }

    return {
      madeForYou: recommendationsData.find((result: any) => result.attributes.title.stringForDisplay === 'Made for You')
        .relationships.contents.data,
      recentPlayed: relationshipsData?.recentPlayed /* ?? recentPlayedAllData */ ?? recentPlayedData?.data,
      heavyRotation: relationshipsData?.heavyRotation /* ?? heavyRotationAllData */ ?? heavyRotationData?.data,
      newReleases:
        relationshipsData?.newReleases ??
        recommendationsData.find((result: any) => result.attributes.title.stringForDisplay === 'New Releases')
          .relationships.contents.data,
      stations: recommendationsData.find(
        (result: any) => result.attributes.title.stringForDisplay === 'Stations for You'
      ).relationships.contents.data,
      recommendations:
        relationshipsData?.recommendations ??
        recommendationsData
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
  }, [
    relationshipsData,
    /* recentPlayedAllData,
    heavyRotationAllData, */
    recommendationsData,
    recentPlayedData,
    heavyRotationData
  ]);

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
        <MediaItemCarousel items={recommendations.recentPlayed} title="Recent Played" />
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

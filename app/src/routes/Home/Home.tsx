import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
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
  const [recommendationsData, setRecommendationsData] = useState(defaultRecommendationsState);

  const { isLoading: recommendationsLoading, error: valenceError, data: recommendations } = useQuery<any>(
    `homeRecommendations`,
    () => MusicKitApiService.Recommendations()
  );
  const { isLoading: recentLoading, error: recentError, data: recentPlayed } = useQuery<any>(
    `homeRecentPlayed`,
    () => MusicKitApiService.RecentPlayed()
  );
  const { isLoading: heavyLoading, error: heavyError, data: heavyRotation } = useQuery<any>(
    `homeHeavyRotation`,
    () => MusicKitApiService.HeavyRotation()
  );

  useEffect(() => {
    if (!recommendations || !recentPlayed || !heavyRotation) {
      return;
    }

    setRecommendationsData({
      madeForYou: recommendations.find((result: any) => result.attributes.title.stringForDisplay === 'Made for You')
        .relationships.contents.data,
      recentPlayed: recentPlayed,
      heavyRotation: heavyRotation,
      newReleases: recommendations.find((result: any) => result.attributes.title.stringForDisplay === 'New Releases')
        .relationships.contents.data,
      stations: recommendations.find((result: any) => result.attributes.title.stringForDisplay === 'Stations for You')
        .relationships.contents.data,
      recommendations: recommendations
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
    });
  }, [recommendations, recentPlayed, heavyRotation]);

  if (!recommendationsData.madeForYou.length) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    );
  }

  return (
    <>
      <h1>Listen Now</h1>
      {recommendationsData.madeForYou.length > 1 && <MediaItemCarousel items={recommendationsData.madeForYou} />}
      {recommendationsData.recentPlayed.length > 1 && (
        <MediaItemCarousel items={recommendationsData.recentPlayed} title="Recent Played" />
      )}
      {recommendationsData.heavyRotation.length > 1 && (
        <MediaItemCarousel items={recommendationsData.heavyRotation} title="Heavy Rotation" />
      )}
      {recommendationsData.newReleases.length > 1 && (
        <MediaItemCarousel items={recommendationsData.newReleases} title="New Releases" />
      )}
      {recommendationsData.recommendations.map((recommendation: any) => (
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

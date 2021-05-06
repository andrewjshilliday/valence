import React, { useEffect, useState } from 'react';
import { MediaItemCarousel } from '../../components/common';
import { MusicKitApiService } from '../../services';

const ListenNow = (): JSX.Element => {
  const [forYou, setForYou] = useState<MusicKit.MediaItem[] | null>(null);
  const [_, setStations] = useState<MusicKit.MediaItem[] | null>(null);
  const [newReleases, setNewReleases] = useState<MusicKit.MediaItem[] | null>(null);
  const [recentPlayed, setRecentPlayed] = useState<MusicKit.MediaItem[] | null>(null);
  const [heavyRotation, setHeavyRotation] = useState<MusicKit.MediaItem[] | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const results = await MusicKitApiService.Recommendations();
      console.log(results);
      setForYou(results[0].relationships.contents.data);
      setStations(results[3].relationships.contents.data);
      setNewReleases(results[11].relationships.contents.data);
      const recommendations = results
        .filter(
          (result: any, index: number) =>
            !result.attributes.isGroupRecommendation && index !== 0 && index !== 3 && index !== 11
        )
        .map((result: any) => ({
          title: result.attributes.title.stringForDisplay,
          items: result.relationships.contents.data
        }));
      setRecommendations(recommendations);
    };
    const fetchRecentPlayed = async () => {
      const results = await MusicKitApiService.RecentPlayed();
      setRecentPlayed(results);
    };
    const fetchHeavyRotation = async () => {
      const results = await MusicKitApiService.HeavyRotation();
      setHeavyRotation(results);
    };
    fetchRecommendations();
    fetchRecentPlayed();
    fetchHeavyRotation();
  }, []);

  return (
    <>
      <h1>Listen Now</h1>
      {forYou && <MediaItemCarousel items={forYou} />}
      {recentPlayed && <MediaItemCarousel items={recentPlayed} title="Recent Played" />}
      {heavyRotation && <MediaItemCarousel items={heavyRotation} title="Heavy Rotation" />}
      {newReleases && <MediaItemCarousel items={newReleases} title="New Releases" />}
      {recommendations &&
        recommendations.map((recommendation: any) => (
          <MediaItemCarousel key={recommendation.title} items={recommendation.items} title={recommendation.title} />
        ))}
    </>
  );
};

export default ListenNow;

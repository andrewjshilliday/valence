import React from 'react';
import styled from 'styled-components';
import { LazyLoadImage as LazyLoadImageComponent } from 'react-lazy-load-image-component';
import { MusicKitService } from '../../../services';
import placeholder from '../../../assets/images/placeholder.jpeg';

interface LazyLoadImageProps extends React.HTMLAttributes<HTMLImageElement> {
  alt: string;
  artwork?: MusicKit.Artwork;
  size?: number;
}

const LazyLoadImage = ({ className, alt, artwork, size = 500 }: LazyLoadImageProps): JSX.Element => (
  <StyledImageContainer className={className}>
    <StyledImage src={artwork ? MusicKitService.FormatArtwork(artwork, size) : placeholder} alt={alt} />
  </StyledImageContainer>
);

const StyledImageContainer = styled.div`
  position: relative;
  height: 0;
  width: 100%;
  padding-top: 100%;
  background-image: url(${placeholder});
  background-size: cover;
  border-radius: 0.5em;
`;

const StyledImage = styled(LazyLoadImageComponent)`
  max-width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  border-radius: 0.5em;
`;

export default LazyLoadImage;

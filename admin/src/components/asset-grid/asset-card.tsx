import React from 'react';
import { Text } from '@buffetjs/core';
import { LoadingIndicator } from '@buffetjs/styles';

import styled from 'styled-components';
import { MuxAsset } from '../../../../models/mux-asset';
import { generateImageUrl } from '../../utils/mux';

import errorIcon from './../../static/error-icon.svg';

const ContainerStyled = styled.div`
  margin-bottom: 16px;
  cursor: pointer;
`;

const BackdropContainerStyled = styled.div`
  position: relative;
`;

interface BackdropProps {
  imageUrl?: string;
}

const BackdropStyled = styled.div<BackdropProps>`
  aspect-ratio: 16 / 9;
  background-color: #333740;
  background-image: url(${props => props.imageUrl});
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 11px;
`;

const LoadingIndicatorContainerStyled = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`;

interface DefaultProps {
  onClick: (muxAsset:MuxAsset) => void;
}
interface Props extends DefaultProps {
  muxAsset: MuxAsset;
}

const AssetCard = (props:Props) => {
  const { muxAsset, onClick } = props;

  const isLoading = muxAsset.asset_id === null;

  const renderStatus = React.useCallback(() => {
    if(muxAsset.error_message !== null) {
      return (<img src={errorIcon} />);
    } else if(isLoading) {
      return (<LoadingIndicator />);
    }
  }, [muxAsset]);

  const thumbnailImageUrl = muxAsset.playback_id !== null ? 
    // If we have a playback_id, construct a thumnail url
    generateImageUrl(muxAsset.playback_id) :
    // Else, we use a transparent single-pixel png data uri
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

  const handleOnClick = () => {
    onClick(muxAsset);
  }

  const loadingTitle = isLoading && "Asset is being processed";
  const errorTitle = isLoading && "Asset encountered an error";

  return (
    <ContainerStyled onClick={handleOnClick} title={errorTitle || loadingTitle || undefined}>
      <BackdropContainerStyled>
        <BackdropStyled imageUrl={thumbnailImageUrl} />
        <LoadingIndicatorContainerStyled>
          {renderStatus()}
        </LoadingIndicatorContainerStyled>
      </BackdropContainerStyled>
      <Text fontSize='md' fontWeight='bold'>{muxAsset.title}</Text>
    </ContainerStyled>
  );
};

AssetCard.defaultProps = {
  onClick: () => {}
} as DefaultProps;

export default AssetCard;

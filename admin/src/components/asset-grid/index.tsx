import React from 'react';
import styled from 'styled-components';

import { MuxAsset } from '../../../../models/mux-asset';
import AssetCard from './asset-card';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-gap: 30px;
  align-items: start;
`;

interface DefaultProps {
  onMuxAssetClick: (muxAsset:MuxAsset) => void;
}

interface Props extends DefaultProps {
  muxAssets:  MuxAsset[] | undefined;
}

const AssetGrid = (props:Props) => {
  const { muxAssets, onMuxAssetClick } = props;

  if(muxAssets === undefined) return null;

  const assets = muxAssets.map((muxAsset) => <AssetCard muxAsset={muxAsset} onClick={onMuxAssetClick} />);
  
  return (
    <Container>
      {assets}
    </Container>
  );
};

AssetGrid.defaultProps = {
  onMuxAssetClick: () => {}
} as DefaultProps;

export default AssetGrid;

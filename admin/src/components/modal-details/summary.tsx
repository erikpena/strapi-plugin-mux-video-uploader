import React from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';

import { MuxAsset } from '../../../../models/mux-asset';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 7px 16px;
  background-color: #FAFAFA;
  color #9EA7B8;

  & > section {
    padding: 9px 0;
  }
`;

const Label = styled.div`
  font-weight: bold;
`;

const DoubleSection = styled.section`
  display: flex;
  flex: 1;

  & > div {
    flex: 1;
  }
`;

interface Props {
  muxAsset?: MuxAsset;
}

const Summary = (props:Props) => {
  const { muxAsset } = props;

  if(muxAsset === undefined) return null;

  const created = DateTime.fromISO(muxAsset.created_at).toFormat('yyyy-MM-dd HH:mm:ss');
  const updated = DateTime.fromISO(muxAsset.updated_at).toFormat('yyyy-MM-dd HH:mm:ss');

  return (
    <Container>
      <section>
        <Label>Asset Id</Label>
        <span>{muxAsset.asset_id}</span>
      </section>
      <section>
        <Label>Upload Id</Label>
        <span>{muxAsset.upload_id}</span>
      </section>
      <section>
        <Label>Playback Id</Label>
        <span>{muxAsset.playback_id}</span>
      </section>
      <DoubleSection>
        <div>
          <Label>Created</Label>
          <span>{created}</span>
        </div>
        <div>
          <Label>Updated</Label>
          <span>{updated}</span>
        </div>
      </DoubleSection>
    </Container>
  );
};

export default Summary;

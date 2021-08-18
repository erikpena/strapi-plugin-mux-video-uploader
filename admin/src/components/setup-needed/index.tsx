import React from 'react';
import styled from 'styled-components';
import { Button } from '@buffetjs/core';
import { useHistory } from "react-router-dom";

import Well from '../../components/well';
import pluginId from '../../pluginId';

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 3rem;
`;

const RowStyled = styled.div`
  margin-bottom: 3rem;
`;

const SetupNeeded = () => {
  const history = useHistory();

  const onSettingsClick = React.useCallback(() => {
    history.push(`/settings/${pluginId}/general`);
  }, []);

  return (
    <Well>
      <ContainerStyled>
        <RowStyled>
          <h1>Setup Needed</h1>
        </RowStyled>
        <RowStyled>
          <p>In order for uploads to function, an administrator will need to complete the setup of this plugin by visiting the settings page.  Click the button below to be taken there now.</p>
        </RowStyled>
          <Button color="primary" label="Settings" onClick={onSettingsClick} />
      </ContainerStyled>
    </Well>
  );
};

export default SetupNeeded;

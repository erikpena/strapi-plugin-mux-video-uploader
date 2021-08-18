import React from 'react';
import styled from 'styled-components';

import ProgressBar from './progress-bar';

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 3rem;
`;

const RowStyled = styled.div`
  margin-bottom: 3rem;
`;

const ProgressBarWrapper = styled.div`
  width: 60%;
`;

interface Props {
  percent: number;
}

const Uploading = (props:Props) => {
  return (<ContainerStyled>
    <RowStyled>
      <h1>Uploading to Mux</h1>
    </RowStyled>
    <ProgressBarWrapper>
      <ProgressBar percent={props.percent} />
    </ProgressBarWrapper>
  </ContainerStyled>)
};

export default Uploading;

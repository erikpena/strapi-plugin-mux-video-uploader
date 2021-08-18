import React from 'react';
import styled from 'styled-components';

const ContainerStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BarStyled = styled.div`
  height: 6px;
  width: 100%;
  background-color: #f3f3f4;
  border-radius: 3px;
  flex-grow: 1;
  margin-right: 1.5rem;
`;

const ProgressStyled = styled.div`
  height: 6px;
  background-color: #007EFF;
  border-radius: 3px;
`;

const ProgressTextStyled = styled.span`
  position: relative;
  color: #B4B6BA;

  :after {
    position: absolute;
    content: '100%';
    opacity: 0;
  }
`;

interface Props {
  percent: number;
}

const ProgressBar = (props:Props) => {
  const { percent } = props;
  const [progress, setProgress] = React.useState<number>(0);

  React.useEffect(() => {
    if(percent <= progress) return;

    setProgress(percent);
  }, [percent]);

  return (<ContainerStyled>
    <BarStyled>
      <ProgressStyled style={{ width: `${progress}%` }} />
    </BarStyled>
    <ProgressTextStyled>{`${progress}%`}</ProgressTextStyled>
  </ContainerStyled>);
};

export default ProgressBar;

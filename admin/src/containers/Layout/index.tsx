
import React from 'react';
import styled from 'styled-components';

import Header from '../../components/header';

const ContainerStyled = styled.div`
  padding: 3.1rem 2.5rem;
`;

const Layout:React.FunctionComponent = (props) => {
  return (
    <ContainerStyled>
      <Header />
      {props.children}
    </ContainerStyled>
  );
};

export default Layout;

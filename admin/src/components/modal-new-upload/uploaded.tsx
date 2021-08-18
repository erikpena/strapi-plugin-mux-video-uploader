import React from 'react';
import styled from 'styled-components';
import { Button } from '@buffetjs/core';

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 3rem;
`;

const SvgStyled = styled.svg`
  vertical-align: bottom;
`;

const RowStyled = styled.div`
  margin-bottom: 3rem;
`;

interface Props extends DefaultProps {}

interface DefaultProps {
  onReset: () => void;
}

const Uploaded = (props:Props) => {
  return (<ContainerStyled>
    <RowStyled>
      <h1>
        Uploading Complete&nbsp;
        <SvgStyled width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
            <defs>
                <rect id="path-1" x="270" y="171" width="1140" height="196"></rect>
                <filter x="-0.6%" y="-2.6%" width="101.2%" height="107.1%" filterUnits="objectBoundingBox" id="filter-2">
                    <feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                    <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0.890196078   0 0 0 0 0.91372549   0 0 0 0 0.952941176  0 0 0 1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
                </filter>
            </defs>
            <g id="Strapi-Plugin" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Desktop---Upload-Complete" transform="translate(-924.000000, -204.000000)">
                    <rect id="Rectangle" fillOpacity="0.05" x="0" y="0" width="1440" height="1024"></rect>
                    <g id="Rectangle">
                        <use fill="black" fillOpacity="1" filter="url(#filter-2)"></use>
                        <use fill="#FFFFFF" fillRule="evenodd"></use>
                    </g>
                    <g id="Group-2" transform="translate(731.000000, 196.000000)" fillRule="nonzero">
                        <g id="fa-regular:check-circle" transform="translate(193.000000, 8.000000)">
                            <g id="Icon" fill="#6DBB1A">
                                <path d="M12,0.375 C5.57967187,0.375 0.375,5.57967187 0.375,12 C0.375,18.4203281 5.57967187,23.625 12,23.625 C18.4203281,23.625 23.625,18.4203281 23.625,12 C23.625,5.57967188 18.4203281,0.375 12,0.375 Z M12,2.625 C17.1811875,2.625 21.375,6.81801562 21.375,12 C21.375,17.1811875 17.1819844,21.375 12,21.375 C6.8188125,21.375 2.625,17.1819844 2.625,12 C2.625,6.8188125 6.81801562,2.625 12,2.625 M18.5720625,8.73126562 L17.5156875,7.66635937 C17.2969219,7.4458125 16.9407656,7.44435937 16.7202187,7.66317187 L10.0943437,14.2357969 L7.29159375,11.4103125 C7.07282812,11.1897656 6.71667187,11.1883125 6.496125,11.4070781 L5.43117187,12.4634531 C5.210625,12.6822188 5.20917188,13.038375 5.42798437,13.2589688 L9.68334375,17.5487813 C9.90210937,17.7693281 10.2582656,17.7707813 10.4788125,17.5519688 L18.5689219,9.52678125 C18.7894219,9.30796875 18.7908281,8.9518125 18.5720625,8.73126563 L18.5720625,8.73126562 Z" id="Icon-Shape"></path>
                            </g>
                            <rect id="ViewBox" x="0" y="0" width="24" height="24"></rect>
                        </g>
                    </g>
                </g>
            </g>
        </SvgStyled>
      </h1>
    </RowStyled>
    <RowStyled>
      <p>The file has been successfully uploaded to Mux and is now able to be referenced by other Content Types within Strapi.</p>
    </RowStyled>
      <Button color="primary" label="Upload Another" onClick={props.onReset} />
  </ContainerStyled>)
};

Uploaded.defaultProps = {
  onReset: () => {}
} as DefaultProps;

export default Uploaded;

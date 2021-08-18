import React from 'react';
import { Button, InputText, Select } from '@buffetjs/core';
import { GlobalPagination } from 'strapi-helper-plugin';
import styled from 'styled-components';
import { DebouncedFunc } from 'lodash';
import debounce from 'lodash.debounce';

import SetupNeeded from '../../components/setup-needed';
import { getIsConfigured, getMuxAssets } from '../../services/strapi';
import Layout from '../Layout';
import AssetGrid from '../../components/asset-grid';
import { GetMuxAssetsResponse, MuxAsset } from '../../../../models/mux-asset';
import { SearchField, SearchVector, SortVector } from '../../services/strapi/types';
import ModalDetails from '../../components/modal-details';
import usePrevious from '../../utils/use-previous';
import ModalNewUpload from '../../components/modal-new-upload';

const SEARCH_FIELDS = [{ 
  label: 'By Title',
  value: SearchField.BY_TITLE,
}, {
  label: 'By Asset Id',
  value: SearchField.BY_ASSET_ID
}] as const;

const ControlsContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  display: flex;

  @media screen and (max-width: 944px) {
    width: 100%;
  }

  @media screen and (min-width: 945px) {
    flex: 1;
  }

  & > * {
    margin-bottom: 30px;
    margin-right: 1rem;
    flex: 1;
  }
`;

const NewUploadButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding-left: 1rem;
  margin-bottom: 30px;

  @media screen and (max-width: 839px) {
    width: 100%;
  }

  @media screen and (min-width: 840px) {
    flex: 1;
  }
`;

const HomePage = () => {
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = React.useState<boolean>(false);
  const [muxAssets, setMuxAssets] = React.useState<GetMuxAssetsResponse|undefined>();
  const [selectedAsset, setSelectedAsset] = React.useState<MuxAsset|undefined>();
  const [isNewUploadOpen, setIsNewUploadOpen] = React.useState<boolean>(false);

  const [searchField, setSearchField] = React.useState<SearchField>(SEARCH_FIELDS[0].value);
  const [searchValue, setSearchValue] = React.useState<string|undefined>(undefined);
  const [pageLimit] = React.useState<number>(20);
  const [pageStart, setPageStart] = React.useState<number>(0);

  const prevSearchField = usePrevious(searchField);
  const prevSearchValue = usePrevious(searchValue);
  const prevPageLimit = usePrevious(pageLimit);
  const prevPageStart = usePrevious(pageStart);

  const loadMuxAssets = async () => {
    let searchVector:SearchVector|undefined = undefined;

    if(searchValue !== undefined) {
      searchVector = {
        field: searchField,
        value: searchValue
      };
    }

    const sortVector:SortVector = { field: 'created_at', desc: true };

    const start = pageStart * pageLimit;

    const data = await getMuxAssets(searchVector, sortVector, start, pageLimit);
    
    setMuxAssets(data);
  }

  const loadMuxAssetsDebounced:DebouncedFunc<any> = debounce(loadMuxAssets, 300);

  React.useEffect(() => {
    getIsConfigured().then(data => {
      setIsReady(data === true);
    });

    () => loadMuxAssetsDebounced.cancel();
  }, []);

  React.useEffect(() => {
    if(!isReady) return;

    if(
      !hasLoaded ||
      (prevSearchField !== searchField && searchValue !== undefined) ||
      prevSearchValue !== searchValue ||
      prevPageStart !== pageStart ||
      prevPageLimit !== pageLimit
    ) {
      loadMuxAssetsDebounced();

      setHasLoaded(true);
    }
  }, [isReady, searchField, searchValue, pageStart, pageLimit]);

  const handleOnSearchFieldChange = (event:any) => {
    const field = event?.target.value === '' ? undefined : event?.target.value;

    if(field !== undefined && field !== searchField) {
      setPageStart(0);
    }

    setSearchField(field);
  };

  const handleOnSearchValueChange = (event:any) => {
    const value = event?.target.value === '' ? undefined : event?.target.value;
    
    setSearchValue(value);
    
    if(value !== undefined && value !== searchValue) {
      setPageStart(0);
    }
  };
  
  const handleOnMuxAssetClick = (muxAsset:MuxAsset) => setSelectedAsset(muxAsset);

  const handleOnDetailsClose = (refresh?:boolean) => {
    setSelectedAsset(undefined);
    if(!refresh) return;
    loadMuxAssets();
  }

  const handleOnNewUploadClose = (refresh:boolean) => {
    setIsNewUploadOpen(false);
    if(!refresh) return;
    loadMuxAssets();
  }

  const handleOnNewUploadClick = () => setIsNewUploadOpen(true);

  const handleOnPaginateChange = ({ target }: { target: { value: number }}) => {
    setPageStart(target.value - 1);
    loadMuxAssets();
  };

  if(!isReady) return <SetupNeeded />;

  return (
    <Layout>
      <div>
        <ControlsContainer>
          <SearchContainer>
            <Select
              options={SEARCH_FIELDS}
              value={searchField}
              onChange={handleOnSearchFieldChange}
            />
            <InputText
              placeholder="Search text"
              type="text"
              value={searchValue}
              onChange={handleOnSearchValueChange}
            />
          </SearchContainer>
          <NewUploadButtonContainer>
            <Button color="primary" label="New Upload" onClick={handleOnNewUploadClick} />
          </NewUploadButtonContainer>
        </ControlsContainer>
        <AssetGrid muxAssets={muxAssets?.items} onMuxAssetClick={handleOnMuxAssetClick} />
        <GlobalPagination
          count={muxAssets?.totalCount}
          params={{_page: pageStart + 1, _limit: pageLimit}}
          onChangeParams={handleOnPaginateChange}
        />
        <ModalDetails 
          isOpen={selectedAsset !== undefined}
          muxAsset={selectedAsset}
          onToggle={handleOnDetailsClose}
        />
        <ModalNewUpload
          isOpen={isNewUploadOpen}
          onToggle={handleOnNewUploadClose}
        />
      </div>
    </Layout>
  );
};

export default React.memo(HomePage);

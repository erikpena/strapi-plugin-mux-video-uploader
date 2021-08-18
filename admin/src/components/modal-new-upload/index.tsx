import React from 'react';
import { createUpload, UpChunk } from '@mux/upchunk';
import { Button, InputText } from '@buffetjs/core';
import { InputText as Input, InputWrapper } from '@buffetjs/styles';
import styled from 'styled-components';
import {
  HeaderModal,
  HeaderModalTitle,
  Label,
  Modal,
  ModalBody,
  ModalForm,
  ModalFooter,
  Tab,
  TabsNav,
  TabsPanel,
  TabPanel,
  Tabs
} from 'strapi-helper-plugin';

import { submitUpload } from '../../services/strapi';
import Uploaded from './uploaded';
import Uploading from './uploading';

type TAB_ORIGIN = 'from_computer' | 'from_url';

const ModalContainer = styled.div`
  & .modal {
    background-color: #f00;
    pointer-events: none;
  }
`;

const HeaderTitle = styled(HeaderModalTitle)`
  text-transform: none;
  align-items: center;
`;

const BodyWrapper = styled.div`
  margin: 0 15px;
  width: 100%;

  // The below is done because using Strapi's tab system
  // will drop any styled-components abstraction.
  & > div > div:first-child {
    justify-content: flex-start;
  }

  & > div > div:first-child > button {
    margin-right: 20px;
    margin-left: 0;
  }
`;

const InputContainer = styled.fieldset`
  & > div {
    margin-bottom: 20px;
  }
`;

const TitleInput = styled(InputText)`
  max-width: 520px;
`;

const FileInput = styled(Input)`
  max-width: 430px;
  padding: 3px;
`;

interface DefaultProps {
  onToggle: (refresh: boolean) => void;
}

interface Props extends DefaultProps{
  isOpen: boolean;
}

interface FormState {
  title?: string;
  file?: File[];
  url?: string;
}

const ModalNewUpload = (props:Props) => {
  const { isOpen, onToggle } = props;

  const [activeTab, setActiveTab] = React.useState<TAB_ORIGIN|undefined>();
  const [state, setState] = React.useState<FormState>({});
  const [uploadPercent, setUploadPercent] = React.useState<number>();
  const [isComplete, setIsComplete] = React.useState<boolean>(false);
  const [uploadError, setUploadError] = React.useState<string>();

  const uploadRef = React.useRef<UpChunk|undefined>();
  const observerRef = React.useRef<IntersectionObserver|undefined>();

  const uploadFile = (endpoint:string, file:File) => {
    setUploadPercent(0);
    
    uploadRef.current = createUpload({ endpoint, file });
    uploadRef.current.on('error', (err) => setUploadError(err.detail));
    uploadRef.current.on('progress', (progressEvt) => {
      if(isComplete) return;
      setUploadPercent(Math.floor(progressEvt.detail));
    });
    uploadRef.current.on('success', () => {
      setIsComplete(true);
      setUploadPercent(undefined);
    });
  }

  const handleOnReset = () => {
    setActiveTab('from_computer');
    setState({});
    setUploadPercent(undefined);
    setIsComplete(false);
    setUploadError(undefined);
  }

  React.useEffect(() => {
    if(isOpen) {
      observerRef.current = new IntersectionObserver((entries) => {
        for(let i = 0; i < entries.length; i++) {
            if(entries[i].isIntersecting !== true) continue;

            if(entries[i].target.id === 'upload-origin-0-tabpanel') {
              setActiveTab('from_computer');
            }
            else if(entries[i].target.id === 'upload-origin-1-tabpanel') {
              setActiveTab('from_url');
            }
        }
      }, { threshold: [.1] });
    
      setTimeout(() => {
        const fromComputerPanel = document.querySelector('#upload-origin-0-tabpanel');
        const fromUrlPanel = document.querySelector('#upload-origin-1-tabpanel');

        if(fromComputerPanel !== null) {
          observerRef.current?.observe(fromComputerPanel);
        } else {
          console.error('Unable to query "From computer" tab panel');
        }

        if(fromUrlPanel !== null) {
          observerRef.current?.observe(fromUrlPanel);
        } else {
          console.error('Unable to query "From url" tab panel');
        }
      }, 300);
    }
    else {
      observerRef.current?.disconnect();
    }
  }, [isOpen]);

  const handleOnSubmit = async (e:any) => {
    e.preventDefault();

    if(state.title === undefined || (state.file === undefined && state.url === undefined) || activeTab === undefined) return;

    let media;

    if(activeTab === 'from_computer' && state.file !== undefined) {
      media = state.file[0];
    } else if(activeTab === 'from_url' && state.url !== undefined) {
      media = state.url;
    } else {
      console.log('Unable to determine upload origin');

      return;
    }

    let result;
    
    try {
      result = await submitUpload(state.title, activeTab, media);
    } catch(error) {
      setUploadError(error);

      return;
    }

    const { statusCode, data } = result;

    if(statusCode && statusCode !== 200) {
      return data?.errors;
    } else if(activeTab === 'from_computer') {
      uploadFile(result.url, media as File);
    } else if(activeTab === 'from_url') {
      setUploadPercent(100);
      setIsComplete(true);
    } else {
      console.log('Unable to resolve upload state');
    }
  };

  const handleOnTitleChange = (e:InputTextOnChange) => setState({ ...state, title: e.target.value });
  const handleOnFileChange = (e:InputFileOnChange) => setState({ ...state, file: e.target.files });
  const handleOnUrlChange = (e:InputTextOnChange) => setState({ ...state, url: e.target.value });

  const handleOnModalClose = (forceRefresh: boolean = false) => {
    onToggle(forceRefresh);
    handleOnReset();
  };

  const handleOnAbort = () => {
    uploadRef.current?.abort();
    handleOnModalClose();
  };

  const handleOnModalFinish = () => handleOnModalClose(true);

  const closeXHandler = React.useCallback(() => {
    if(isComplete || uploadPercent === undefined) {
      handleOnModalClose();
    }
  }, [isComplete, uploadPercent]);

  const renderBody = () => {
    if(isComplete) {
      return (<Uploaded onReset={handleOnReset} />);
    } else if(uploadPercent !== undefined) {
      return (<Uploading percent={uploadPercent} />);
    } else {
      return (
        <TabsNav defaultSelection={0} label="Upload origin" id="upload-origin">
          <Tabs>
            <Tab>From computer</Tab>
            <Tab>From url</Tab>
          </Tabs>
          <TabsPanel>
            <TabPanel>
              <InputContainer disabled={activeTab !== 'from_computer'}>
                <div>
                  <Label message="Title" />
                  <TitleInput
                    name="from-computer-title"
                    type="text"
                    value={state.title}
                    onChange={handleOnTitleChange}
                    required
                  />
                </div>
                <div>
                  <Label message='File' />
                  <InputWrapper>
                    <FileInput
                      id="file"
                      name="file"
                      type="file"
                      onChange={handleOnFileChange}
                      required
                    />
                  </InputWrapper>
                </div>
              </InputContainer>
            </TabPanel>
            <TabPanel>
            <InputContainer disabled={activeTab !== 'from_url'}>
                <div>
                  <Label message="Title" />
                  <TitleInput
                    name="from-url-title"
                    type="text"
                    value={state.title}
                    onChange={handleOnTitleChange}
                    required
                  />
                </div>
                <div>
                  <Label message='Url' />
                  <TitleInput
                    name="from-url-url"
                    type="url"
                    value={state.url}
                    onChange={handleOnUrlChange}
                    required
                  />
                </div>
              </InputContainer>
            </TabPanel>
          </TabsPanel>
        </TabsNav>
      );
    }
  };

  const renderFooter = () => {
    if(isComplete) {
      return (
        <section>
          <div />
          <Button onClick={handleOnModalFinish} color="primary">Finish</Button>
        </section>
      );
    } else if(uploadPercent !== undefined) {
      return (
        <section>
          <Button onClick={handleOnAbort} color="cancel">Cancel</Button>
        </section>
      );
    } else {
      return (
        <section>
          <Button onClick={handleOnModalClose} color="cancel">Cancel</Button>
          <Button type="submit" color="success">Submit</Button>
        </section>
      );
    }
  };

  return (
    <ModalContainer>
      {/* Extends reactstrap's Modal options: https://getbootstrap.com/docs/4.0/components/modal/#options */}
      <Modal isOpen={isOpen} onToggle={closeXHandler} backdrop='static' keyboard={false}>
        <HeaderModal>
          <section>
            <HeaderTitle>New upload</HeaderTitle>
          </section>
        </HeaderModal>
        <form onSubmit={handleOnSubmit}>
          <ModalForm>
            <ModalBody>
              <BodyWrapper>
                {renderBody()}
              </BodyWrapper>
            </ModalBody>
          </ModalForm>
          <ModalFooter>
            {renderFooter()}
          </ModalFooter>
        </form>
      </Modal>
    </ModalContainer>
  )
}

ModalNewUpload.defaultProps = {
  onToggle: () => {}
} as DefaultProps;

export default ModalNewUpload;

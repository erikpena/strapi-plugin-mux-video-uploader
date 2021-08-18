import React from 'react';
import { Button, InputText, Padded, Toggle } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { HeaderModal, HeaderModalTitle, Label, Modal, ModalBody, ModalForm, ModalFooter, PopUpWarning } from 'strapi-helper-plugin';
import styled from 'styled-components';
import { Formik, Form, FormikErrors, FormikHelpers, ErrorMessage, Field, FieldProps, FormikTouched } from 'formik';

import { MuxAsset } from '../../../../models/mux-asset';
import PreviewPlayer from '../preview-player';
import Summary from './summary';
import { deleteMuxAsset, setMuxAsset } from '../../services/strapi';

const HeaderTitle = styled(HeaderModalTitle)`
  text-transform: none;
  align-items: center;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 60px;
  overflow: hidden;

  & > div {
    flex: 1;
    margin: 0 15px;
  }
`;

const ErrorMessageStyled = styled(ErrorMessage)`
  color: #f00;
  font-size: smaller;
`;

const MetadataContainer = styled.div`
  padding: -10px 0;

  & > div {
    padding-bottom: 20px;
  }
`;

const ErrorContainer = styled(Padded)`
  background-color: #FEEDE6;
`;

const LeftFooterContainer = styled.div`
  margin: auto 0px;

  & > * {
    margin-right: 10px !important;
  }
`;

interface FormProps {
  title: string;
  isReady: boolean;
}

interface DefaultProps {
  onToggle: (refresh?:boolean) => void;
}

interface Props extends DefaultProps{
  isOpen: boolean;
  muxAsset?: MuxAsset;
}

const ModalDetails = (props:Props) => {
  const { isOpen, muxAsset, onToggle } = props;

  if(muxAsset === undefined) return null;

  const [touchedFields, setTouchedFields] = React.useState<FormikTouched<FormProps>>({});
  const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const toggleDeleteWarning = () => setShowDeleteWarning(prevState => !prevState);

  const handleOnDeleteConfirm = async () => {
    setIsProcessing(true);

    await deleteMuxAsset(muxAsset);

    setIsProcessing(false);

    toggleDeleteWarning();
    onToggle(true);
  };

  const handleValidate = (values:FormProps) => {
    const errors:FormikErrors<FormProps> = {};
    if (values.title) {
      errors.title = 'Required';
    }
    return errors;
  }

  const handleOnSubmit = async (values:FormProps, actions:FormikHelpers<FormProps>) => {
    if(Object.keys(touchedFields).length > 0) {
      const data:any = { id: muxAsset.id };
      
      if(touchedFields.title) {
        data.title = values.title;
      }

      if(touchedFields.isReady) {
        data.isReady = values.isReady;
      }
      
      await setMuxAsset(data);
    }

    actions.setSubmitting(false);

    onToggle(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} onToggle={onToggle}>
        <HeaderModal onToggle={onToggle}>
          <section>
            <HeaderTitle>Details</HeaderTitle>
          </section>
        </HeaderModal>
        <Formik 
          initialValues={{ title: muxAsset.title, isReady: muxAsset.isReady }} 
          validate={handleValidate}
          onSubmit={handleOnSubmit}
        >
          {({
            handleSubmit,
            isSubmitting
          }) => (
            <form onSubmit={handleSubmit}>
              <ModalForm>
                <ModalBody>
                  <BodyWrapper>
                    <div>
                      <PreviewPlayer muxAsset={muxAsset} />
                    </div>
                    <MetadataContainer>
                      { 
                        muxAsset.error_message &&
                        <div>
                          <ErrorContainer top bottom right left size="sm">
                            {muxAsset.error_message}
                          </ErrorContainer>
                        </div>
                      }
                      <div>
                        <Label message='Title' />
                        <Field name="title">
                          {({ field: { value }, form: { setFieldValue } }:FieldProps) => (
                            <>
                              <InputText
                                type="text"
                                value={value}
                                onChange={(e:InputTextOnChange) => {
                                  setFieldValue('title', e.target.value);
                                  setTouchedFields({...touchedFields, title: true });
                                }}
                              />
                              <ErrorMessageStyled name="title" component="div" />
                            </>
                          )}
                        </Field>
                      </div>
                      <div>
                        <Label message='Is ready' />
                        <Field name="isReady">
                          {({ field: { value }, form: { setFieldValue } }:FieldProps) => (
                            <Toggle
                              value={value}
                              onChange={(e:ToggleOnChange) => {
                                setFieldValue('isReady', e.target.value);
                                setTouchedFields({...touchedFields, isReady: true });
                              }}
                            />
                          )}
                        </Field>
                      </div>
                      <div>
                        <Summary muxAsset={muxAsset} />
                      </div>
                    </MetadataContainer>
                  </BodyWrapper>
                </ModalBody>
              </ModalForm>
              <ModalFooter>
                <section>
                  <LeftFooterContainer>
                    <Button onClick={onToggle} color="cancel">Cancel</Button>
                    <Button onClick={toggleDeleteWarning} color="delete" icon={<FontAwesomeIcon icon={faTrashAlt} />}>Delete</Button>
                  </LeftFooterContainer>
                  <Button type="submit" color="success" disabled={isSubmitting}>Finish</Button>
                </section>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </Modal>
      <PopUpWarning
        isOpen={showDeleteWarning}
        toggleModal={toggleDeleteWarning}
        content={{
          message: 'Are you sure you want to delete this item?',
          secondMessage: 'This will also delete the Asset from Mux.'
        }}
        popUpWarningType="danger"
        isConfirmButtonLoading={isProcessing}
        onConfirm={handleOnDeleteConfirm}
      />
    </>
  )
}

ModalDetails.defaultProps = {
  onToggle: () => {}
} as DefaultProps;

export default ModalDetails;

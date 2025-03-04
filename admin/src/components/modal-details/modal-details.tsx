import React from 'react';
import { FormikHelpers, FormikTouched, useFormik } from 'formik';
import copy from 'copy-to-clipboard';
import {
  Box,
  Button,
  Dialog,
  Field,
  Flex,
  Grid,
  IconButton,
  Link,
  Modal,
  Status,
  Textarea,
  Typography,
} from '@strapi/design-system';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { Duplicate, Trash, WarningCircle } from '@strapi/icons';

import { MuxAsset, MuxAssetUpdate } from '../../../../server/src/content-types/mux-asset/types';
import usePluginIntl from '../../utils/use-plugin-intl';
import CustomTextTrackForm from '../modal-new-upload/custom-text-track-form';
import PreviewPlayer from '../preview-player';
import Summary from './summary';
import { PLUGIN_ID } from '../../pluginId';

export default function ModalDetails(props: {
  onToggle: (refresh: boolean) => void;
  isOpen: boolean;
  muxAsset?: MuxAsset;
  enableUpdate: boolean;
  enableDelete: boolean;
}) {
  const { isOpen, muxAsset, enableUpdate, enableDelete, onToggle = () => {} } = props;

  const { del, put } = useFetchClient();
  const { formatMessage } = usePluginIntl();

  const deleteButtonRef = React.useRef<HTMLButtonElement>(null);

  const [touchedFields, setTouchedFields] = React.useState<FormikTouched<MuxAssetUpdate>>({});
  const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);
  const [deletingState, setDeletingState] = React.useState<'idle' | 'deleting'>('idle');
  const [codeSnippet, setCodeSnippet] = React.useState<string>('');

  const { toggleNotification } = useNotification();

  React.useEffect(() => {
    if (!muxAsset) return;

    setCodeSnippet(`<mux-player
  playback-id="${muxAsset?.playback_id}"
  playback-token="TOKEN"
  env-key="ENV_KEY"
  metadata-video-title="${muxAsset?.title}"
  controls
/>`);
  }, [muxAsset]);

  const subtitles = (muxAsset?.asset_data?.tracks ?? []).filter(
    (track: any) => track.type === 'text' && track.text_type === 'subtitles' && track.status !== 'errored'
  );

  const toggleDeleteWarning = () => setShowDeleteWarning((prevState) => !prevState);

  const handleCopyCodeSnippet = () => {
    copy(codeSnippet);

    toggleNotification({
      type: 'success',
      message: formatMessage('ModalDetails.copied-to-clipboard', 'Copied code snippet to clipboard'),
    });
  };

  const handleOnDeleteConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingState('deleting');
    toggleDeleteWarning();

    if (!muxAsset) return;

    try {
      await del(`${PLUGIN_ID}/mux-asset/${muxAsset.id}`, {
        params: {
          delete_on_mux: true,
        },
      });

      setDeletingState('idle');

      onToggle(true);
      toggleNotification({
        type: 'success',
        message: formatMessage('ModalDetails.delete-success', 'Video deleted successfully'),
      });
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: formatMessage('ModalDetails.failed-to-delete', 'Failed to delete video'),
      });
    }
  };

  const initialValues: MuxAssetUpdate = {
    id: muxAsset?.id || 0,
    title: muxAsset?.title || muxAsset?.asset_id || muxAsset?.createdAt,

    // @ts-expect-error Due to changes in @mux/mux-node v8, where `TextTrack`, `VideoTrack` and `AudioTrack` were unified,
    // properties required to subtitles as text tracks are showing as optional and breaking the `custom_text_tracks` type.
    custom_text_tracks: subtitles.map((s) => ({
      closed_captions: s.closed_captions,
      file: undefined,
      language_code: s.language_code,
      name: s.name,
      status: s.status,
      stored_track: s,
    })),
  };

  const handleOnSubmit = async (
    values: MuxAssetUpdate,
    { setErrors, setSubmitting }: FormikHelpers<MuxAssetUpdate>
  ) => {
    const title = formatMessage('Common.title-required', 'No title specified');

    if (!values.title) {
      setErrors({ title });

      return;
    }

    const tracksModified =
      JSON.stringify(values.custom_text_tracks || []) !== JSON.stringify(initialValues.custom_text_tracks || []);

    const data: MuxAssetUpdate = {
      id: muxAsset?.id || 0,
      title: touchedFields.title ? values.title : undefined,
      custom_text_tracks: tracksModified ? values.custom_text_tracks : undefined,
    };

    if (data.title || data.custom_text_tracks) {
      await put(`${PLUGIN_ID}/mux-asset/${muxAsset?.id}`, data);
    }

    setSubmitting(false);

    onToggle(true);
  };

  const handleOnOpenChange = (open: boolean) => {
    if (open) return;

    onToggle(false);
  };

  const { errors, values, isSubmitting, handleChange, handleSubmit, setFieldValue } = useFormik<MuxAssetUpdate>({
    initialValues,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  if (!muxAsset) return null;

  const aspect_ratio = muxAsset.aspect_ratio || muxAsset.asset_data?.aspect_ratio;

  return (
    <form>
      <Modal.Root open={isOpen} onOpenChange={handleOnOpenChange}>
        <Modal.Content
          style={{
            width: 'min(90vw, 100rem)',
            maxWidth: 'unset',
          }}
        >
          <Modal.Header>
            <Modal.Title>{formatMessage('ModalDetails.header', 'Video details')}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ paddingInline: 20 }}>
            {deletingState === 'deleting' ? (
              <Flex justifyContent="center" padding={4}>
                <Typography variant="omega" textColor="neutral700">
                  {formatMessage('ModalDetails.deleting', 'Deleting...')}
                </Typography>
              </Flex>
            ) : (
              <Grid.Root gap={4} style={{ alignItems: 'flex-start' }}>
                <Grid.Item col={6} s={12} direction="column" alignItems="start">
                  <Box
                    background="neutral150"
                    style={{
                      aspectRatio: aspect_ratio ? aspect_ratio.replace(':', ' / ') : undefined,
                      marginBottom: '1.5rem',
                      padding: '3rem 0',
                      position: 'relative',
                    }}
                    width="100%"
                  >
                    <PreviewPlayer muxAsset={muxAsset} />

                    <Dialog.Root open={showDeleteWarning}>
                      <Dialog.Trigger>
                        <IconButton
                          label={formatMessage('Common.delete-button', 'Delete')}
                          disabled={!enableDelete}
                          onClick={toggleDeleteWarning}
                          withTooltip={false}
                          ref={deleteButtonRef}
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                          }}
                        >
                          <Trash />
                        </IconButton>
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header>
                          {formatMessage(
                            'ModalDetails.delete-confirmation-prompt',
                            'Are you sure you want to delete this item?'
                          )}
                        </Dialog.Header>
                        <Dialog.Body>
                          <Flex padding={4} direction="column" gap={2}>
                            <Box textAlign="center">
                              <WarningCircle />
                            </Box>
                            <Flex justifyContent="center">
                              <Typography>
                                {formatMessage(
                                  'ModalDetails.delete-confirmation-prompt',
                                  'Are you sure you want to delete this item?'
                                )}
                              </Typography>
                            </Flex>
                            <Flex justifyContent="center">
                              <Typography>
                                {formatMessage(
                                  'ModalDetails.delete-confirmation-callout',
                                  'This will also delete the Asset from Mux.'
                                )}
                              </Typography>
                            </Flex>
                          </Flex>
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Button onClickCapture={toggleDeleteWarning} variant="tertiary">
                            {formatMessage('Common.cancel-button', 'Cancel')}
                          </Button>
                          <Button variant="danger-light" startIcon={<Trash />} onClickCapture={handleOnDeleteConfirm}>
                            {formatMessage('Common.confirm-button', 'Confirm')}
                          </Button>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Root>
                  </Box>

                  <Box width="100%">
                    <Field.Root>
                      <Field.Label>{formatMessage('Captions.title', 'Captions / subtitles')}</Field.Label>
                      <CustomTextTrackForm
                        custom_text_tracks={values.custom_text_tracks || []}
                        modifyCustomTextTracks={(newTracks) => setFieldValue('custom_text_tracks', newTracks)}
                        muxAsset={muxAsset}
                      />
                    </Field.Root>
                  </Box>
                </Grid.Item>
                <Grid.Item col={6} s={12} direction="column" alignItems="start">
                  {muxAsset.error_message ? (
                    <Box paddingBottom={4} width="100%">
                      <Status variant="danger">
                        <Typography>{muxAsset.error_message}</Typography>
                      </Status>
                    </Box>
                  ) : null}
                  <Box paddingBottom={4} width="100%">
                    <Field.Root id="with_field" error={errors.title}>
                      <Field.Label>{formatMessage('Common.title-label', 'Title')}</Field.Label>
                      <Field.Input
                        name="title"
                        hasError={errors.title !== undefined}
                        value={values.title}
                        disabled={!enableUpdate}
                        required
                        onChange={(e: any) => {
                          setTouchedFields({ ...touchedFields, title: true });
                          handleChange(e);
                        }}
                      />
                      <Field.Error />
                    </Field.Root>
                  </Box>
                  <Box paddingBottom={4} width="100%">
                    <Summary muxAsset={muxAsset} />
                  </Box>
                  <Box paddingBottom={4} width="100%">
                    <Field.Root
                      hint={
                        <>
                          {formatMessage('ModalDetails.powered-by-mux', 'Powered by mux-player.')}
                          &nbsp;
                          <Link href="https://docs.mux.com/guides/video/mux-player" isExternal>
                            {formatMessage('ModalDetails.read-more', 'Read more about it')}
                          </Link>
                        </>
                      }
                    >
                      <Field.Label style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        {formatMessage('ModalDetails.code-snippet', 'Code snippet')}
                        <IconButton
                          label="More actions"
                          borderStyle="none"
                          withTooltip={false}
                          onClick={handleCopyCodeSnippet}
                        >
                          <Duplicate />
                        </IconButton>
                      </Field.Label>
                      <Textarea name="codeSnippet" value={codeSnippet} rows={7} disabled />
                      <Field.Hint />
                    </Field.Root>
                  </Box>
                </Grid.Item>
              </Grid.Root>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button variant="tertiary" onClick={() => onToggle(false)} disabled={deletingState === 'deleting'}>
                {formatMessage('Common.cancel-button', 'Cancel')}
              </Button>
            </Modal.Close>
            <Button variant="success" disabled={deletingState === 'deleting' || isSubmitting} onClick={handleSubmit}>
              {formatMessage('Common.finish-button', 'Finish')}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </form>
  );
}

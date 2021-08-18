import axios from 'axios';

import { getConfig } from "./strapi";

const getAssetIdByUploadId = async (uploadId:string) => {
  const config = await getConfig('general');

  const result = await axios(`https://api.mux.com/video/v1/assets`, {
    params: {
      upload_id: uploadId
    },
    auth: {
      username: config.access_token,
      password: config.secret_key
    },
    headers: { 'Content-Type': 'application/json' }
  });

  return result.data.data[0].id;
};

const getDirectUploadUrl = async (corsOrigin:string = "*") => {
  const config = await getConfig('general');

  const result = await axios({
    url: 'https://api.mux.com/video/v1/uploads',
    method: "post",
    auth: {
      username: config.access_token,
      password: config.secret_key
    },
    headers: { 'Content-Type': 'application/json' },
    data: { "cors_origin": corsOrigin, "new_asset_settings": { "playback_policy": ["public"] } }
  });

  return result.data.data;
}

const createAsset = async (url:string, ) => {
  const config = await getConfig('general');

  const body = { "input": url, "playback_policy": ["public"] };

  const result = await axios('https://api.mux.com/video/v1/assets', {
    method: "post",
    validateStatus: () => true,
    auth: {
      username: config.access_token,
      password: config.secret_key
    },
    headers: { 'Content-Type': 'application/json' },
    data: body
  });

  return result.data.data;
};

const deleteAsset = async (assetId:string) => {
  const config = await getConfig('general');
  
  const muxResult = await axios(`https://api.mux.com/video/v1/assets/${assetId}`, {
    method: "delete",
    auth: {
      username: config.access_token,
      password: config.secret_key
    },
    headers: { 'Content-Type': 'application/json' }
  });

  return muxResult.status === 204;
};

export {
  getAssetIdByUploadId,
  getDirectUploadUrl,
  createAsset,
  deleteAsset
};

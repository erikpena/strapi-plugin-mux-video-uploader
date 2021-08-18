import { pick, isEmpty } from 'lodash';
import { Context } from 'koa';

import { setConfig, getConfig, deleteConfig } from "../services/strapi";

const isConfiged = async (ctx:Context) => {
  const config = await getConfig('general');

  if(!config.access_token) ctx.send(false);
  else if(!config.secret_key) ctx.send(false);
  else if(!config.webhook_signing_secret) ctx.send(false);
  else ctx.send(true);
};

const clearConfig = async (ctx:Context) => {
  await deleteConfig('general');

  ctx.send({ message: 'ok' });
};

const saveConfig = async (ctx:Context) => {
  const config = pick(ctx.request.body, 'access_token', 'secret_key', 'webhook_signing_secret');

  let successful = false;

  if(!isEmpty(config)) {
    successful = await setConfig('general', config);
  }

  if(isEmpty(config) || !successful) {
    ctx.send({ message: `Nothing to update` });
  } else {
    ctx.send({ message: `Updated ${Object.keys(config).join(', ')}` });
  }
};

export {
  isConfiged,
  clearConfig,
  saveConfig
};

import _ from 'lodash';

const NAME = 'mux';
const CONFIG_KEY = 'config';

const getStore = () => strapi.store({
  environment: strapi.config.environment,
  type: 'plugin',
  name: NAME,
});

function configKey(key:string) { return `${CONFIG_KEY}_${key}` };

const deleteConfig = (key:string) => strapi.query('core_store').delete(
  { key: `plugin_${NAME}_${CONFIG_KEY}_${key}` });

const getConfig = async (key:string) => (await getStore().get({ key: configKey(key) })) || {};

const setConfig = async (key:string, value:any) => {
  const storedConfig = (await getStore().get({ key: configKey(key) })) || {};

  const currentConfig = { ...storedConfig };
  
  Object.keys(value).forEach((key:string) => {
    if (value[key] !== null && value[key] !== undefined) {
      _.set(currentConfig, key, value[key]);
    }
  });

  if (!_.isEqual(currentConfig, storedConfig)) { 
    getStore().set({
      key: configKey(key),
      value: currentConfig,
    });

    return true;
  }

  return false;
};

export {
  deleteConfig,
  getConfig,
  setConfig
};

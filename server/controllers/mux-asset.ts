import { Context } from 'koa';

import pluginId from './../../admin/src/pluginId';

const model = `plugin::${pluginId}.mux-asset`;

const search = (ctx: Context) => {
  const params = ctx.query;

  if (!params.sort) {
    params.sort = 'createdAt';
  }

  if (!params.order) {
    params.order = 'desc';
  }

  return strapi.entityService.findMany(model, params);
}

const find = async (ctx: Context) => {
  const entities = await search(ctx);
  const totalCount = await count(ctx);

  const items = entities.map((entity:any) => entity);

  return { items, totalCount };
};

const findOne = async (ctx: Context) => {
  const { id } = ctx.params;

  return await strapi.entityService.findOne(model, id, ctx.query);
};

const count = (ctx: Context) => {
  const params = ctx.query;

  return strapi.entityService.count(model, params);
};

const create = async (ctx: Context) => {
  const { body } = ctx.request;
  
  return await strapi.entityService.create(model, { data: body });
};

const update = async (ctx:Context) => {
  const { id } = ctx.params;
  const { body } = ctx.request;

  const data: { title?: string, isReady?: boolean } = {};
  
  if (body.title !== undefined) {
    data.title = body.title;
  }
  if (body.isReady !== undefined) {
    data.isReady = body.isReady;
  }
  
  return await strapi.entityService.update(model, id, { data });
};

const del = async (ctx:Context) => {
  const { id } = ctx.params;

  return await strapi.entityService.delete(model, id);
};

export = {
  find,
  findOne,
  count,
  create,
  update,
  del
};

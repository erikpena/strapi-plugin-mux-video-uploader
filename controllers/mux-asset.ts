// @ts-ignore
import { sanitizeEntity, parseMultipartData } from 'strapi-utils';
import { Context } from 'koa';

import pluginId from './../admin/src/pluginId';

const model = `plugins::${pluginId}.mux-asset`;

const search = (ctx:Context) => {
  if (ctx.query._q) {
    return strapi.entityService.search({params: ctx.query}, { model });
  }

  return strapi.entityService.find({params: ctx.query}, { model });
}

const index = async (ctx:Context) => {
  ctx.send({
    message: 'ok'
  });
};

const find = async (ctx:Context) => {
  const entities = await search(ctx);
  const totalCount = await count(ctx);

  const items = entities.map((entity:any) => sanitizeEntity(entity, {model: { options: {}, attributes:[]}}));

  return {
    items,
    totalCount
  };
};

const findOne = async (ctx:Context) => {
  const { id } = ctx.params;

  const entity = await strapi.entityService.findOne({ id }, { model });

  return sanitizeEntity(entity, {model: { options: {}, attributes:[]}});
};

const count = (ctx:Context) => {
  if (ctx.query._q) {
    return strapi.entityService.countSearch({params: ctx.query}, { model });
  }
  
  return strapi.entityService.count({params: ctx.query}, { model });
};

const create = async (ctx:Context) => {
  let entity;
  
  if (ctx.is('multipart')) {
    const { data, files } = parseMultipartData(ctx);

    entity = await strapi.entityService.create({ data, files }, { model });
  } else {
    entity = await strapi.entityService.create({ data: ctx.request.body }, { model });
  }

  return sanitizeEntity(entity, {model: { options: {}, attributes:[]}});
};

const update = async (ctx:Context) => {
  const { id } = ctx.params;

  let entity;

  if (ctx.is('multipart')) {
    const { data, files } = parseMultipartData(ctx);

    entity = await strapi.entityService.update({ params: { id }, data, files }, { model });
  } else {
    entity = await strapi.entityService.update({ params: { id }, data: ctx.request.body }, { model });
  }

  return sanitizeEntity(entity, {model: { options: {}, attributes:[]}});
};

const del = async (ctx:Context) => {
  const { id } = ctx.params;

  const entity = await strapi.entityService.delete({ params: { id } }, { model });

  return sanitizeEntity(entity, {model: { options: {}, attributes:[]}});
};

export {
  index,
  find,
  findOne,
  count,
  create,
  update,
  del
}

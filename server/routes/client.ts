const routes = [
  {
    method: 'GET',
    path: '/mux-asset',
    handler: 'mux-asset.find',
    config: {
      description: 'Returns all the MuxAsset items',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-asset/count',
    handler: 'mux-asset.count',
    config: {
      description: 'Returns a count of MuxAsset items',
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/mux-asset/:documentId',
    handler: 'mux-asset.findOne',
    config: {
      description: 'Returns a MuxAsset based on a supplied document id',
      policies: [],
    },
  },
];

export default routes;

const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postCommentsHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;

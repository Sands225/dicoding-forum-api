const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentsHandler = this.postCommentsHandler.bind(this);
  }

  async postCommentsHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;
    const payloads = {
      threadId,
      owner,
      content: request.payload.content,
    };

    const addedComment = await addCommentUseCase.execute(payloads);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;

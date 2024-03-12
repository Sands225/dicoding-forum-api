/* eslint-disable no-param-reassign */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.checkThreadId(threadId);
    const getComments = await this._commentRepository.getComments(threadId);
    const detailThread = await this._threadRepository.getDetailThread(threadId, getComments);
    detailThread.comments.forEach((part, index, commentArrays) => {
      if (part.is_delete) {
        commentArrays[index].content = '**komentar telah dihapus**';
      }
      delete commentArrays[index].is_delete;
    });
    return detailThread;
  }
}
module.exports = GetDetailThreadUseCase;

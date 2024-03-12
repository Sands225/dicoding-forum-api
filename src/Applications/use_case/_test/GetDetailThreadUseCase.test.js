/* eslint-disable no-undef */
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('GetDetailThreadUseCase', () => {
  it('should orchestring get detail thread action correctly', async () => {
    const threadId = 'thread-123';
    const useCasePayload = { threadId };
    const comments = [{
      id: 'comment-123',
      username: 'dicoding',
      date: new Date('24-12-05 23:50:55'),
      content: 'first comment',
      is_delete: false,
    },
    {
      id: 'comment-456',
      username: 'dicoding',
      date: new Date('24-12-05 23:50:55'),
      content: '**komentar telah dihapus**',
      is_delete: true,
    }];
    const thread = {
      id: 'thread-123',
      title: 'a title',
      body: 'a body',
      date: new Date('24-12-05 23:50:55'),
      username: 'dicoding',
      comments,
    };
    // creating dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // mocking needed function
    mockThreadRepository.checkThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(threadId));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    // creating use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const getDetailThread = await getDetailThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkThreadId).toBeCalledWith(threadId);
    expect(mockCommentRepository.getComments).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(threadId, thread);
    expect(getDetailThread.id).toEqual('thread-123');
  });
});

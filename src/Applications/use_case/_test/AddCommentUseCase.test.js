/* eslint-disable no-undef */
const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const threadId = 'thread-123';
    const useCasePayload = {
      threadId,
      owner: 'user-123',
      content: 'a comment',
    };
    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'a comment',
      owner: 'user-123',
    });

    // creating dependency of use case
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.checkThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(threadId));

    // creating use case instance
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    }));
  });
});

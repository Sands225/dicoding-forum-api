/* eslint-disable no-undef */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should return added thread correctly', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'encrypted-password',
        fullname: 'Dicoding Indonesia',
      });
      const addThread = new AddThread({
        owner: 'user-123',
        title: 'thread title',
        body: 'body title',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'thread title',
        owner: 'user-123',
      }));
    });
  });

  describe('check availability thread id with checkThreadId function', () => {
    it('should not throw an error when thread id is found ', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'encrypted-password',
        fullname: 'Dicoding Indonesia',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        owner: 'user-123',
        title: 'thread title',
        body: 'body title',
      });
      const threadId = 'thread-123';
      const fakeIdGenerator = '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(threadRepositoryPostgres.checkThreadId(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});

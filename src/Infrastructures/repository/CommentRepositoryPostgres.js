const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addCommentPayload) {
    const { threadId, owner, content } = addCommentPayload;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, thread_id, owner, content',
      values: [id, threadId, owner, content],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async checkCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE  id=$1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Invalid comment id');
    }
    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Comment does not belong to the user');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = \'true\' WHERE id=$1',
      values: [commentId],
    };
    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;

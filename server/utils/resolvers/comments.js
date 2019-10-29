const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const authorizer = require('../authorizer');

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      const { alias } = authorizer(context);
      if (body.trim() === '') {
        throw new UserInputError('Comments cannot be empty.', {
          errors: {
            body: 'Comment body must not be empty.'
          }
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          alias,
          createdAt: new Date().toISOString()
        });
        await post.save();
        return post;
      } else throw new UserInputError('Post not found.');
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { alias } = authorizer(context);
      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(
          comment => comment.id === commentId
        );

        if (post.comments[commentIndex].alias === alias) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else throw new AuthenticationError('Action not allowed.');
      } else throw new UserInputError('Post not found.');
    }
  }
};

const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegisterInput, validateLoginInput } = require('../validators');
const { SECRET_KEY } = require('../../env');
const { UserInputError } = require('apollo-server');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      alias: user.alias
    },
    SECRET_KEY,
    { expiresIn: '7d' }
  );
}
module.exports = {
  Query: {
    async users() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },
    async user(_, { userId, alias }) {
      try {
        const user = await User.findOne(alias ? { alias } : { userId });
        if (user) {
          return user;
        } else {
          throw new Error('User not found.')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    async login(_, { alias, password }) {
      const { errors, valid } = validateLoginInput(alias, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ alias });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found.', {
          errors
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Incorrect Credentials.';
        throw new UserInputError('Incorrect Credentials.', {
          errors
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register(
      _,
      {
        registerInput: { alias, email, password, confirmPassword }
      },
      context,
      info
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        alias,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }
      // Check if user exists
      const user = await User.findOne({ alias, email });
      if (user) {
        throw new UserInputError('Username or Email is taken.', {
          errors: {
            alias: 'This alias is taken.',
            email: 'This email is in use. Log in instead.'
          }
        });
      }
      // Hash Passwords & assign token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        alias,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};

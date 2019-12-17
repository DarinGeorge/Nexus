const Beacon = require('../../models/Beacon');
const authorizer = require('../authorizer');
const { AuthenticationError } = require('apollo-server');

module.exports = {
  Query: {
    async beacons() {
      try {
        const beacons = await Beacon.find();
        return beacons;
      } catch (err) {
        throw new Error(err);
      }
    },
    async beaconsByUser(_, { userId }) {
      try {
        const beacon = await Beacon.find({ user: userId });
        if (beacon) {
          return beacon;
        } else {
          throw new Error('No beacons not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createBeacon(
      _,
      { name, location, description, date, time },
      context
    ) {
      const user = authorizer(context);

      if (
        name.trim() === '' ||
        location.trim() === '' ||
        description.trim() === ''
      ) {
        throw new Error('required fields must not be empty.');
      }

      const beacon = await Beacon.create({
        name,
        user: user.id,
        description,
        location,
        date,
        time,
        createdAt: new Date().toISOString()
      });

      return beacon;
    },
    async deleteBeacon(_, { beaconId }, context) {
      const user = authorizer(context);
      try {
        const beacon = await Beacon.findById(beaconId);
        if (user.alias === beacon.alias) {
          await Beacon.delete();
          return 'beacon deleted successfully.';
        } else {
          throw new AuthenticationError('Action not allowed.');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Beacon: {
    async user(beacon) {
      return (await beacon.populate('user').execPopulate()).user;
    }
  }
};

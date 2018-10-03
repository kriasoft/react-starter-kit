import {
  GraphQLString as StringType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';
import UnitType from '../types/UnitType';
import Unit from '../models/Unit';
import Course from '../models/Course';

const createUnit = {
  type: UnitType,
  args: {
    title: {
      description: 'The title of the new unit',
      type: new NonNull(StringType),
    },
    courseId: {
      description: 'Id of the unit',
      type: new NonNull(StringType),
    },
    body: {
      description: 'body of the unit',
      type: StringType,
    },
  },
  async resolve({ request }, args) {
    try {
      if (!request.user) throw new Error('User is not logged in');
      const role = await request.user.getRole(args.courseId);
      if (!request.user.isAdmin && (!role || role !== 'teacher'))
        throw new Error("User doesn't have rights to edit this course");
      let c;
      return Course.findById(args.courseId)
        .then(course => {
          c = course;
          return Unit.create({ title: args.title, body: args.body });
        })
        .then(unit => {
          unit.setCourses([c]);
          return unit.save();
        })
        .catch(err => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

const removeUnit = {
  type: UnitType,
  args: {
    id: {
      description: 'id of the Unit',
      type: new NonNull(StringType),
    },
  },
  resolve(parent, args) {
    return Unit.findById(args.id)
      .then(unit => unit.destroy())
      .then(() => {});
  },
};

const units = {
  type: new List(UnitType),
  args: {
    ids: {
      description: 'ids of the Unit',
      type: new List(StringType),
    },
  },
  resolve(obj, args) {
    if (args.ids) {
      return Unit.findAll({
        where: {
          id: args.ids,
        },
      });
    }
    return Unit.findAll();
  },
};

const updateUnit = {
  type: UnitType,
  args: {
    id: {
      description: 'id of the Unit',
      type: new NonNull(StringType),
    },
    title: {
      description: 'The title of the Unit',
      type: StringType,
    },
    body: {
      description: 'The body of the Unit',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Unit.findById(args.id).then(unit => unit.update({ ...args }));
  },
};

export { createUnit, removeUnit, units, updateUnit };

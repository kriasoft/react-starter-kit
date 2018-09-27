import { GraphQLString as StringType, GraphQLList as List } from 'graphql';
import UnitType from '../types/UnitType';
import Unit from '../models/Unit';
import Course from '../models/Course';

const createUnit = {
  type: UnitType,
  args: {
    title: {
      description: 'The title of the new unit',
      type: StringType,
    },
    courseId: {
      description: 'Id of the unit',
      type: StringType,
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

// when this method is called there is crash in GraphQL
const removeUnit = {
  type: UnitType,
  args: {
    id: {
      description: 'id of the Unit',
      type: StringType,
    },
  },
  resolve(parent, args) {
    return Unit.destroy({
      where: {
        id: args.id,
      },
    });
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
      type: StringType,
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
    Unit.findById(args.id).then(_se => {
      const se = _se;
      if (args.title) {
        se.title = args.title;
      }
      if (args.body) {
        se.body = args.body;
      }
      return se.save();
    });
  },
};

export { createUnit, removeUnit, units, updateUnit };

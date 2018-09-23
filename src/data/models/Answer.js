import DataType from 'sequelize';
import Model from '../sequelize';
import Mark from './Mark';

const Answer = Model.define('Answer', {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  body: {
    type: DataType.STRING,
  },
});

class SchemaChecker {
  static create(schema) {
    const checker = new SchemaChecker();
    checker.schema =
      typeof schema === 'string'
        ? (checker.schema = JSON.parse(schema))
        : schema;
    checker.names = Object.keys(checker.schema).filter(
      k => checker.schema[k].checker,
    );
    checker.fns = checker.names.reduce((fns, k) => {
      fns[k] = checker.build(k);
      return fns;
    }, {});
    return checker;
  }

  // TODO: use nodejs vm instead of eval
  build(key) {
    /* eslint-disable no-new-func */
    return new Function(
      'val',
      'key',
      'doc',
      'schema',
      this.schema[key].checker,
    );
  }

  run(answer, key) {
    return this.fns[key](answer[key], key, answer, this.schema);
  }
}

function getMarkForAnswer(answerStr, schema) {
  if (!answerStr) return {};
  const answer = JSON.parse(answerStr);
  const checker = SchemaChecker.create(schema);
  const res = { mark: 0, comment: 'Marks:' };
  for (let i = 0; i < checker.names.length; i += 1) {
    const m = checker.run(answer, checker.names[i]);
    res.mark += (m || 0) / checker.names.length;
    res.comment += ` ${m}`;
  }
  return res;
}

Answer.hook('afterUpdate', async answer => {
  const studyEntity = await answer.getStudyEntity();
  const mark = getMarkForAnswer(answer.body, studyEntity.schema);
  // TODO: use special authorId (or the user who added answer)
  if (mark && mark.mark) {
    Mark.create({
      mark: mark.mark,
      comment: mark.comment,
      AnswerId: answer.id,
      // authorId: args.authorId,
    });
  }
});

export default Answer;

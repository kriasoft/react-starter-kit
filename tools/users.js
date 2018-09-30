import readlineSync from 'readline-sync';
import User from '../src/data/models/User';
import UserLogin from '../src/data/models/UserLogin';
import UserClaim from '../src/data/models/UserClaim';
import models from '../src/data/models';

const promise = models.sync().catch(err => console.error(err.stack));

class UsersCmds {
  constructor() {
    this.message = console;
  }
  add() {
    this.message.log('Adding new user:');
    const email = readlineSync.questionEMail('E-mail: ');
    const key = readlineSync.questionNewPassword('Password: ', { min: 6 });
    const name = readlineSync.question('Name: ');
    const gender = readlineSync.question('Gender [male]: ') || 'male';
    const isAdmin =
      readlineSync.question('Is Admin [N/y]? ').toLowerCase() === 'y';
    User.createUser({
      email,
      key,
      name,
      gender,
      isAdmin,
    }).then(() => process.exit());
  }
  async reset() {
    this.message.log('Reset existing user:');
    const email = readlineSync.questionEMail('E-mail: ');
    const key = readlineSync.questionNewPassword('Password: ', { min: 3 });

    const users = await User.findAll({
      attributes: ['id', 'email'],
      where: {
        '$logins.name$': 'local',
        '$logins.key$': email,
        '$claims.type$': 'local',
      },
      include: [
        {
          attributes: ['name', 'key'],
          model: UserLogin,
          as: 'logins',
          required: true,
        },
        {
          model: UserClaim,
          as: 'claims',
          required: true,
        },
      ],
    });
    users[0].dataValues.claims.filter(cl => cl.type === 'local').forEach(cl => {
      cl.set('value', User.hashPassword(key));
      cl.save();
    });
  }
}

async function main() {
  const usersCmds = new UsersCmds();
  switch (process.argv[2]) {
    case 'add':
      usersCmds.add();
      break;
    case 'reset':
      await usersCmds.reset();
      break;
    default:
      throw new Error({
        message: 'wrong command',
        argv: process.argv,
      });
  }
}

promise.then(main);

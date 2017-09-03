import readlineSync from 'readline-sync';
import User from '../src/data/models/User';
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
    const isAdmin = readlineSync.question('Is Admin [N/y]? ') === 'y';
    User.createUser({
      email,
      key,
      name,
      gender,
      isAdmin,
    });
  }
}

function main() {
  const usersCmds = new UsersCmds();
  switch (process.argv[2]) {
    case 'add':
      usersCmds.add();
      break;
    default:
      throw new Error({
        message: 'wrong command',
        argv: process.argv,
      });
  }
}

promise.then(main);

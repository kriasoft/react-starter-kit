import DataLoader from 'dataloader';
import getPerson from '../queries/getPerson';

export default {
  personLoader: new DataLoader(people => Promise.all(people.map(_id => getPerson(_id)) ))
}

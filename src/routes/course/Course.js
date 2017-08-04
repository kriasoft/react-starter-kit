/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Course.css';
import { addStudyEntity } from '../../actions/study_entities';

let dispatch;
let fetch;

class Course extends React.Component {
  static propTypes = {
    store: PropTypes.objectOf(React.store).isRequired,
    fetch: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      studyEntities: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    dispatch = props.store.dispatch;
    fetch = props.fetch;
    this.state = {
      studyEntityName: '',
      studyEntities: this.props.store.getState().course.studyEntities,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.store.subscribe(() => {
      this.setState({
        studyEntities: this.props.store.getState().course.studyEntities,
      });
    });
  }

  handleChange(event) {
    this.setState({ studyEntityName: event.target.value });
  }

  render() {
    const self = this;
    async function add() {
      const resp = await fetch('/graphql', {
        body: JSON.stringify({
          query: `mutation { 
            createStudyEntity(
              title: "${self.state.studyEntityName}",
              courseId: "${self.props.course.id}")
            { id, title }
          }`,
        }),
      });
      const { data } = await resp.json();
      dispatch(addStudyEntity(data.createStudyEntity));
    }
    const studyEntitiesList = [];
    for (let i = 0; i < this.state.studyEntities.length; i += 1) {
      studyEntitiesList.push(
        <li key={this.state.studyEntities[i].id}>
          <a
            href={`/courses/${this.props.course.id}/${this.props.course
              .studyEntities[i].id}`}
          >
            {this.state.studyEntities[i].title}
          </a>
        </li>,
      );
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <ol>
            {studyEntitiesList}
          </ol>
        </div>
        <input
          type="text"
          value={this.state.studyEntityName}
          onChange={this.handleChange}
        />
        <button onClick={add}>Add Study Entity</button>
      </div>
    );
  }
}

export default withStyles(s)(Course);

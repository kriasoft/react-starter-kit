/* eslint-disable import/prefer-default-export */

import {
  ADD_COURSE,
  SET_COURSES,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
} from '../constants';

import courses from './courses.gql';
import userCourses from './userCourses.gql';
import * as createCourseGql from './createCourse.gql';

export function addCourse({ id, title }) {
  return {
    type: ADD_COURSE,
    data: {
      id,
      title,
    },
  };
}

export function setCourses(c) {
  return {
    type: SET_COURSES,
    data: c,
  };
}

export function addUserToCourse(id, courseId) {
  return {
    type: SUBSCRIBE_USER,
    data: {
      id,
      courseId,
    },
  };
}

export function deleteUserFromCourse(id, courseId) {
  return {
    type: UNSUBSCRIBE_USER,
    data: {
      id,
      courseId,
    },
  };
}

export function fetchCourses(forUser) {
  return (dispatch, getState, { graphqlRequest }) => {
    const user = getState().user || {};
    return graphqlRequest
      .apply(this, forUser ? [userCourses, { users: [user] }] : [courses])
      .then(
        ({ data }) => dispatch(setCourses(data.courses)),
        // error => console.log(error),
      );
  };
}

export function createCourse(title) {
  return (dispatch, getState, { graphqlRequest }) =>
    graphqlRequest(createCourseGql, { title }).then(
      ({ data }) => dispatch(addCourse(data.createCourse)),
      // error => console.log(error),
    );
}

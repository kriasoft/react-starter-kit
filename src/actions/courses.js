/* eslint-disable import/prefer-default-export */

import {
  ADD_COURSE,
  SET_COURSES,
  SET_COURSE,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
  UPDATE_COURSE,
} from '../constants';

import courses from '../gql/courses.gql';
import courseUsers from '../gql/courseUsers.gql';
import createCourseGql from '../gql/createCourse.gql';

export function addCourse({ id, title }) {
  return {
    type: ADD_COURSE,
    data: {
      id,
      title,
    },
  };
}

export function updateCourse({ title }) {
  return {
    type: UPDATE_COURSE,
    data: {
      title,
    },
  };
}

export function setCourse(c) {
  return {
    type: SET_COURSE,
    data: c,
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

export function deleteUserFromCourse({ id }) {
  return {
    type: UNSUBSCRIBE_USER,
    data: {
      id,
    },
  };
}

export function fetchCourses(user) {
  return (dispatch, getState, { graphqlRequest }) =>
    graphqlRequest
      .apply(this, user.isAdmin ? [courses] : [courseUsers, { users: [user] }])
      .then(({ data }) => dispatch(setCourses(data.courses)))
      // eslint-disable-next-line
      .catch(err => console.log(err));
}

export function createCourse(title) {
  return (dispatch, getState, { graphqlRequest }) =>
    graphqlRequest(createCourseGql, { title })
      .then(({ data }) => dispatch(addCourse(data.createCourse)))
      // eslint-disable-next-line
      .catch(err => console.log(err));
}

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
import loadCourse from '../gql/loadCourse.gql';
import updateCourseGql from '../gql/updateCourse.gql';

export function addCourse({ id, title }) {
  return {
    type: ADD_COURSE,
    data: {
      id,
      title,
    },
  };
}

export function renameCourse({ title }) {
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

export function fetchCourse(id) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(loadCourse, { id });
    dispatch(setCourse(data.courses[0]));
  };
}

export function fetchCourses(user) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest.apply(
      this,
      user.isAdmin ? [courses] : [courseUsers, { users: [user] }],
    );
    dispatch(setCourses(data.courses));
  };
}

export function createCourse(title) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(createCourseGql, { title });
    dispatch(addCourse(data.createCourse));
  };
}

export function updateCourse(title) {
  return async (dispatch, getState, { graphqlRequest }) => {
    const { id } = getState().course;
    const { data } = await graphqlRequest(updateCourseGql, { title, id });
    dispatch(renameCourse(data.updateCourse));
  };
}

/* eslint-disable import/prefer-default-export */

import {
  ADD_COURSE,
  SET_COURSES,
  SET_COURSE,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
  UPDATE_COURSE,
} from '../constants';

import courseUsers from '../gql/courseUsers.gql';
import createCourseGql from '../gql/createCourse.gql';
import loadCourse from '../gql/loadCourse.gql';
import updateCourseGql from '../gql/updateCourse.gql';
import subscribeUserGql from '../gql/subscribeUser.gql';
import unsubscribeUserGql from '../gql/unsubscribeUser.gql';

export function addCourse(course) {
  return {
    type: ADD_COURSE,
    data: course,
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

export function addUserToCourse(user) {
  return {
    type: SUBSCRIBE_USER,
    data: user,
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
    return dispatch(setCourse(data.courses[0]));
  };
}

export function fetchCourses(id) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(courseUsers, { id });
    return dispatch(setCourses(data.courses));
  };
}

export function createCourse(title) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(createCourseGql, { title });
    return dispatch(addCourse(data.createCourse));
  };
}

export function updateCourse(title) {
  return async (dispatch, getState, { graphqlRequest }) => {
    const { id } = getState().course;
    const { data } = await graphqlRequest(updateCourseGql, { title, id });
    return dispatch(renameCourse(data.updateCourse));
  };
}

export function subscribeUser(id, role = 'student') {
  return async (dispatch, getState, { graphqlRequest }) => {
    const courseId = getState().course.id;
    const { data } = await graphqlRequest(subscribeUserGql, {
      id,
      role,
      courseId,
    });
    return dispatch(addUserToCourse({ ...data.addUserToCourse, role }));
  };
}

export function unsubscribeUser(id) {
  return async (dispatch, getState, { graphqlRequest }) => {
    const courseId = getState().course.id;
    const { data } = await graphqlRequest(unsubscribeUserGql, {
      id,
      courseId,
    });
    return dispatch(deleteUserFromCourse(data.deleteUserFromCourse));
  };
}

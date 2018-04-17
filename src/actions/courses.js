/* eslint-disable import/prefer-default-export */

import {
  ADD_COURSE,
  SET_COURSES,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
} from '../constants';

export function addCourse({ id, title }) {
  return {
    type: ADD_COURSE,
    data: {
      id,
      title,
    },
  };
}

export function setCourses(courses) {
  return {
    type: SET_COURSES,
    data: courses,
  };
}

export function addUserToCourse(user) {
  return {
    type: SUBSCRIBE_USER,
    data: user,
  };
}

export function deleteUserFromCourse(id) {
  return {
    type: UNSUBSCRIBE_USER,
    data: id,
  };
}

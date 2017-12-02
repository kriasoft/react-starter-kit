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

export function subscribeUser(id, courseId) {
  return {
    type: SUBSCRIBE_USER,
    data: {
      id,
      courseId,
    },
  };
}

export function unsubscribeUser(id, courseId) {
  return {
    type: UNSUBSCRIBE_USER,
    data: {
      id,
      courseId,
    },
  };
}

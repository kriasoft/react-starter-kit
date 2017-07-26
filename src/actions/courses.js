/* eslint-disable import/prefer-default-export */

import { ADD_COURSE, SET_COURSES } from '../constants';

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

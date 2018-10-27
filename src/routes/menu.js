/* eslint-disable import/prefer-default-export */

export function getCourseSecondMenu(course) {
  return [
    {
      level: 2,
      id: course.id,
      title: 'Units',
      link: `/courses/${course.id}`,
    },
    {
      level: 2,
      id: `${course.id}/users`,
      title: 'Users list',
      link: `/courses/${course.id}/users`,
    },
    {
      level: 2,
      id: `${course.id}/marks`,
      title: 'Marks list',
      link: `/courses/${course.id}/marks`,
    },
  ];
}

import { gql } from "@apollo/client";

export const CREATE_COURSE_RESULT = gql`
  mutation createCourseResult($name: String!, $score: Int!, $learnerId: ID!) {
    createCourseResult(name: $name, score: $score, learnerId: $learnerId) {
      id
      name
      score
      learnerId
    }
  }
`;

export const UPDATE_COURSE_RESULT = gql`
  mutation updateCourseResult($id: ID!, $name: String!, $score: Int!, $learnerId: ID!) {
    updateCourseResult(id: $id, name: $name, score: $score, learnerId: $learnerId) {
      id
      name
      score
      learnerId
    }
  }
`;

export const GET_COURSE_RESULTS = gql`
  query getCourseResults {
    courseResults {
      id
      name
      score
      learnerId
    }
  }
`;

export const DELETE_COURSE_RESULT = gql`
  mutation deleteCourseResult($id: ID!) {
    deleteCourseResult(id: $id)
  }
`;
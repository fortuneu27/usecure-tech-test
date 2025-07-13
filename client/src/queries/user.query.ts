import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation createUser($firstName: String!, $lastName: String!, $email: String!) {
    createUser(firstName: $firstName, lastName: $lastName, email: $email) {
      id
      firstName
      lastName
      email
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser($id: ID!, $firstName: String!, $lastName: String!, $email: String!) {
    updateUser(id: $id, firstName: $firstName, lastName: $lastName, email: $email) {
      id
      firstName
      lastName
      email
    }
  }
`

export const GET_USERS = gql`
  query getUsers($offset: Int, $limit: Int) {
    users(offset: $offset, limit: $limit) {
      users {
        id
        firstName
        lastName
        email
      }
      totalCount
    }
  }
`

export const GET_USER_DETAILS = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      courseResults {
        id
        name
        score
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`
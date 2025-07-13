import gql from 'graphql-tag'

export default gql`
    extend type Query {
        users(offset: Int, limit: Int): UserListResult!
        user(id: ID!): User!
    }
    
    type UserListResult {
        users: [User!]!
        totalCount: Int!
    }

    type User {
        id: ID
        firstName: String
        lastName: String
        email: String
        courseResults: [CourseResult!]!
    }
    
    extend type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!): User
        deleteUser(id: ID!): Boolean
        updateUser(id: ID!, firstName: String, lastName: String, email: String): User
    }
`

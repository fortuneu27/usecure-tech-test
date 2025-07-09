import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  {
    users {
      lastName
      email
      courseResults {
        name
      }
    }
  }
`

export const UserView = () => {
  const { loading, error, data } = useQuery(GET_USERS)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  // ToDo: Display your users
  // Check the console log to make sure you're pulling your users in correctly.
  console.log({
    users: data.users
  })

  return (
    <div>
      <h1>User View</h1>
    </div>
  )
}

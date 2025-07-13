import { randomUUID } from 'crypto'

export default {
  User: {
    firstName: (parent, args, context, info) => parent.firstName,
    lastName: (parent, args, context, info) => parent.lastName,
    email: (parent, args, context, info) => parent.email,
    courseResults: async (parent, args, { db }, info) => {
      return db.chain.get('courseResults').filter({ learnerId: parent.id }).value()
    }
  },
  Query: {
    users: async (parent, { offset, limit }, { db }, info) => {
      const allUsers = db.chain.get('users').value();
      let paginatedUsers = allUsers;
      if (typeof offset === 'number' && typeof limit === 'number') {
        paginatedUsers = allUsers.slice(offset, offset + limit);
      }
      return {
        users: paginatedUsers,
        totalCount: allUsers.length
      };
    },
    user: async (parent, args, { db }, info) => {
      const user = db.chain.get('users').find({id: args.id}).value()
      if (!user) return null
      return user
    }
  },
  Mutation: {
    createUser: async (parent, { firstName, lastName, email }, { db }, info) => {
      const newUser = {
        id: randomUUID(),
        firstName,
        lastName,
        email
      }
      await db.update(({ users }) => users.push(newUser))

      return newUser
    },
    deleteUser: async (parent, { id }, { db }, info) => {
      let deleted = false;
      await db.update(({ users }) => {
        const idx = users.findIndex(u => u.id === id);
        if (idx !== -1) {
          users.splice(idx, 1);
          deleted = true;
        }
      });
      return deleted;
    },
    updateUser: async (parent, { id, firstName, lastName, email }, { db }, info) => {
      let updatedUser = null;
      await db.update(({ users }) => {
        const user = users.find(u => u.id === id);
        if (user) {
          user.firstName = firstName;
          user.lastName = lastName;
          user.email = email;
          updatedUser = { ...user };
        }
      });
      return updatedUser;
    }
  }
}

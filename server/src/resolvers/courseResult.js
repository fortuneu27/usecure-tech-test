export default {
  CourseResult: {
    name: async (parent, args, context, info) => parent.name,
    score: async (parent, args, context, info) => parent.score,
    learnerId:  async (parent, args, context, info) => parent.learnerId
  },
  Query: {
    courseResults: async (parent, args, { db }, info) => {
      return db.get('courseResults').value()
    },
    courseResult: async (parent, args, { db }, info) => {
      // ToDo: Return a course result
    }
  },
  Mutation: {
    createCourseResult: async (parent, { name, score, learnerId }, { db }, info) => {
      // ToDo: Create course
    },
    deleteCourseResult: async (parent, { userId }, { db }, info) => {
      // ToDo: Delete course
    },
    updateCourseResult: async (parent, { id, firstName, lastName, email }, { db }, info) => {
      // ToDo: Update course
    }
  }
}

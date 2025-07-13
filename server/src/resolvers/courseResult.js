import { randomUUID } from 'crypto'

export default {
  CourseResult: {
    name: async (parent, args, context, info) => parent.name,
    score: async (parent, args, context, info) => parent.score,
    learnerId:  async (parent, args, context, info) => parent.learnerId
  },
  Query: {
    courseResults: async (parent, args, { db }, info) => {
      return db.get('courseResults').filter({ learnerId: parent.learnerId }).value()
    },
    courseResult: async (parent, args, { db }, info) => {
      return db.get('courseResults').find({ learnerId: parent.learnerId, id: args.id }).value()
    }
  },
  Mutation: {
    createCourseResult: async (parent, { name, score, learnerId }, { db }, info) => {
      // ToDo: Create course
      const newCourseResult = {
        id: randomUUID(),
        name,
        score,
        learnerId
      }
      await db.update(({ courseResults }) => courseResults.push(newCourseResult))
      return newCourseResult
    },
    deleteCourseResult: async (parent, { id }, { db }, info) => {
      await db.update(({ courseResults }) => {
        const idx = courseResults.findIndex(cr => cr.id === id);
        if (idx !== -1) {
          courseResults.splice(idx, 1);
        }
      });
      return true;
    },
    updateCourseResult: async (parent, { id, name, score, learnerId }, { db }, info) => {
      let updatedCourseResult = null;
      await db.update(({ courseResults }) => {
        const courseResult = courseResults.find(cr => cr.id === id);
        if (courseResult) {
          courseResult.name = name;
          courseResult.score = score;
          courseResult.learnerId = learnerId;
          updatedCourseResult = { ...courseResult };
        }
      });
      return updatedCourseResult;
    }
  }
}

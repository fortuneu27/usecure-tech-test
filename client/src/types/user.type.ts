import type { CourseResult } from "./courseResult.type";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseResults?: CourseResult[];
}

export type UserListResult = {
  users: User[];
  totalCount: number;
}
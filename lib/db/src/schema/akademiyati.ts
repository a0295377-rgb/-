import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const usersTable = pgTable("akademiyati_users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const teacherProfilesTable = pgTable("akademiyati_teacher_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  subject: text("subject").notNull(),
  grades: text("grades").array().notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar").notNull(),
  studentsCount: integer("students_count").notNull().default(0),
  rating: real("rating").notNull().default(5),
  verified: boolean("verified").notNull().default(false),
});

export const contentTable = pgTable("akademiyati_content", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade").notNull(),
  topic: text("topic").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  views: integer("views").notNull().default(0),
  duration: text("duration"),
  thumbnail: text("thumbnail"),
});

export const shortVideosTable = pgTable("akademiyati_short_videos", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  topic: text("topic").notNull(),
  thumbnail: text("thumbnail").notNull(),
  duration: text("duration").notNull(),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
});

export const quizzesTable = pgTable("akademiyati_quizzes", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  teacherName: text("teacher_name").notNull(),
  duration: integer("duration").notNull(),
  questions: jsonb("questions").$type<unknown[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quizAttemptsTable = pgTable("akademiyati_quiz_attempts", {
  id: text("id").primaryKey(),
  quizId: text("quiz_id").notNull(),
  studentId: text("student_id").notNull(),
  score: integer("score").notNull(),
  correctCount: integer("correct_count").notNull(),
  totalCount: integer("total_count").notNull(),
  answers: integer("answers").array().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const enrollmentsTable = pgTable("akademiyati_enrollments", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  teacherId: text("teacher_id").notNull(),
  progress: integer("progress").notNull().default(0),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
});

export const postsTable = pgTable("akademiyati_posts", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id").notNull(),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  body: text("body").notNull(),
  likes: integer("likes").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscriptionsTable = pgTable("akademiyati_subscriptions", {
  studentId: text("student_id").primaryKey(),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("active"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true });
export const insertTeacherSchema = createInsertSchema(teacherProfilesTable);
export const insertContentSchema = createInsertSchema(contentTable).omit({ publishedAt: true });
export const insertShortVideoSchema = createInsertSchema(shortVideosTable).omit({ views: true, likes: true });
export const insertQuizSchema = createInsertSchema(quizzesTable).omit({ createdAt: true });
export const insertQuizAttemptSchema = createInsertSchema(quizAttemptsTable).omit({ completedAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollmentsTable).omit({ enrolledAt: true });
export const insertPostSchema = createInsertSchema(postsTable).omit({ createdAt: true });
export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable);

export type User = z.infer<typeof insertUserSchema>;
export type TeacherProfile = typeof teacherProfilesTable.$inferSelect;
export type Content = typeof contentTable.$inferSelect;
export type ShortVideo = typeof shortVideosTable.$inferSelect;
export type Quiz = typeof quizzesTable.$inferSelect;
import { relations } from "drizzle-orm";
import { pgTable, text, integer, serial, pgEnum, boolean, timestamp } from "drizzle-orm/pg-core";

// Bảng Courses: giữ integer cho id vì nhập thủ công
export const courses = pgTable("courses", {
    id: integer("id").primaryKey(), // Tự nhập thủ công
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

// Bảng Units: đổi sang serial
export const units = pgTable("units", {
    id: serial("id").primaryKey(), // Tự động tăng
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id],
    }),
    challenges: many(challenges),
}));

// Enum cho Challenges
export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST", "ACTION"]);

// Bảng challenges với trường mới expectedActionResult
export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    type: challengesEnum("type").notNull(),
    question: text("question"), // Có thể null
    imageSrc: text("image_src"), // Có thể null
    order: integer("order").notNull(),
    expectedActionResult: text("expected_action_result"), // Thêm trường mới, có thể null
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengeOptions: many(challengeOptions),
    challengeProgress: many(challengeProgress),
}));

// Bảng Challenge Options: đổi sang serial
export const challengeOptions = pgTable("challenge_options", {
    id: serial("id").primaryKey(), // Tự động tăng
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    text: text("text"),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeOptions.challengeId],
        references: [challenges.id],
    }),
}));

// Bảng Challenge Progress: đổi sang serial
export const challengeProgress = pgTable("challenge_progress", {
    id: serial("id").primaryKey(), // Tự động tăng
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id],
    }),
}));

// Bảng User Progress: userId giữ text, không đổi
export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(), // Giữ text vì liên quan đến hệ thống xác thực
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/lingo-jump.svg"),
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});

export const UserProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));

// Bảng User Subscription: đổi sang serial
export const userSubscription = pgTable("user_subscription", {
    id: serial("id").primaryKey(), // Tự động tăng
    userId: text("user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});
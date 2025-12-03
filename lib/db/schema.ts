import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core"

import { user } from "./auth-schema"

export const crosshairs = pgTable(
  "crosshairs",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    author: varchar("author", { length: 120 }).notNull(),
    hero: varchar("hero", { length: 60 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 32 }).notNull(),
    color: varchar("color", { length: 32 }).notNull(),
    thickness: integer("thickness").notNull().default(1),
    crosshairLength: integer("crosshair_length").notNull().default(6),
    centerGap: integer("center_gap").notNull().default(4),
    opacity: integer("opacity").notNull().default(100),
    outlineOpacity: integer("outline_opacity").notNull().default(100),
    dotSize: integer("dot_size").notNull().default(0),
    dotOpacity: integer("dot_opacity").notNull().default(0),
    showAccuracy: boolean("show_accuracy").notNull().default(false),
    scale: integer("scale").notNull().default(1),
    imageUrl: text("image_url"),
    imageKey: text("image_key"),
    likes: integer("likes").notNull().default(0),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    heroIdx: index("crosshair_hero_idx").on(table.hero),
    typeIdx: index("crosshair_type_idx").on(table.type),
    userIdx: index("crosshair_user_idx").on(table.userId),
  }),
)

export const crosshairLikes = pgTable(
  "crosshair_likes",
  {
    id: serial("id").primaryKey(),
    crosshairId: integer("crosshair_id")
      .notNull()
      .references(() => crosshairs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    crosshairIdx: index("crosshair_likes_crosshair_idx").on(table.crosshairId),
    userIdx: index("crosshair_likes_user_idx").on(table.userId),
    uniqueLike: uniqueIndex("crosshair_likes_user_crosshair_uidx").on(table.userId, table.crosshairId),
  }),
)

export const crosshairFavorites = pgTable(
  "crosshair_favorites",
  {
    id: serial("id").primaryKey(),
    crosshairId: integer("crosshair_id")
      .notNull()
      .references(() => crosshairs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    crosshairIdx: index("crosshair_favorites_crosshair_idx").on(table.crosshairId),
    userIdx: index("crosshair_favorites_user_idx").on(table.userId),
    uniqueFavorite: uniqueIndex("crosshair_favorites_user_crosshair_uidx").on(table.userId, table.crosshairId),
  }),
)

export type Crosshair = InferSelectModel<typeof crosshairs>
export type NewCrosshair = InferInsertModel<typeof crosshairs>
export type CrosshairLike = InferSelectModel<typeof crosshairLikes>
export type CrosshairFavorite = InferSelectModel<typeof crosshairFavorites>

export * from "./auth-schema"

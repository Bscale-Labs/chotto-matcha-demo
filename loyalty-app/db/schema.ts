import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

export const appRole = pgEnum("app_role", ["customer", "cashier", "branch_manager", "manager"]);
export const rewardType = pgEnum("reward_type", ["item", "merch"]);
export const transactionType = pgEnum("transaction_type", ["earn", "redeem", "manual"]);
export const orgConfigValueType = pgEnum("org_config_value_type", [
  "string",
  "number",
  "boolean",
  "asset_id"
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow()
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow()
});

export const staffProfiles = pgTable(
  "staff_profiles",
  {
    id: text("id").primaryKey(),
    authUserId: text("auth_user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    emailIdx: index("staff_profiles_email_idx").on(t.email),
    activeIdx: index("staff_profiles_active_idx").on(t.active)
  })
);

export const branches = pgTable(
  "branches",
  {
    id: text("id").primaryKey(),
    code: text("code"),
    name: text("name").notNull(),
    address: text("address").notNull(),
    googleMapsUrl: text("google_maps_url"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    codeIdx: index("branches_code_idx").on(t.code),
    activeIdx: index("branches_active_idx").on(t.active)
  })
);

export const userRoles = pgTable(
  "user_roles",
  {
    authUserId: text("auth_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: appRole("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    pk: primaryKey({ columns: [t.authUserId, t.role] }),
    roleIdx: index("user_roles_role_idx").on(t.role)
  })
);

export const staffRoleDetails = pgTable(
  "staff_role_details",
  {
    staffProfileId: text("staff_profile_id")
      .notNull()
      .references(() => staffProfiles.id, { onDelete: "cascade" }),
    role: appRole("role").notNull(),
    branchId: text("branch_id").references(() => branches.id, { onDelete: "set null" }),
    pinHash: text("pin_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    pk: primaryKey({ columns: [t.staffProfileId, t.role] }),
    staffProfileUniqueIdx: uniqueIndex("staff_role_details_staff_profile_unique_idx").on(t.staffProfileId),
    roleBranchIdx: index("staff_role_details_role_branch_idx").on(t.role, t.branchId)
  })
);

export const customers = pgTable(
  "customers",
  {
    id: text("id").primaryKey(),
    authUserId: text("auth_user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    pointsBalance: integer("points_balance").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    emailIdx: uniqueIndex("customers_email_idx").on(t.email),
    phoneIdx: uniqueIndex("customers_phone_idx").on(t.phone),
    activeIdx: index("customers_active_idx").on(t.active)
  })
);

export const assets = pgTable(
  "assets",
  {
    id: text("id").primaryKey(),
    bucketKey: text("bucket_key").notNull().unique(),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    size: integer("size").notNull(),
    uploadedByStaffProfileId: text("uploaded_by_staff_profile_id").references(() => staffProfiles.id, {
      onDelete: "set null"
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    uploadedByIdx: index("assets_uploaded_by_idx").on(t.uploadedByStaffProfileId)
  })
);

export const rewards = pgTable(
  "rewards",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    imageAssetId: text("image_asset_id").references(() => assets.id, { onDelete: "set null" }),
    pointCost: integer("point_cost").notNull(),
    type: rewardType("type").notNull(),
    stockCount: integer("stock_count"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    activeTypeIdx: index("rewards_active_type_idx").on(t.active, t.type)
  })
);

export const rewardTiers = pgTable(
  "reward_tiers",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    minPoints: integer("min_points").notNull(),
    sortOrder: integer("sort_order").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    sortOrderIdx: uniqueIndex("reward_tiers_sort_order_idx").on(t.sortOrder),
    minPointsIdx: index("reward_tiers_min_points_idx").on(t.minPoints),
    activeIdx: index("reward_tiers_active_idx").on(t.active)
  })
);

export const rewardBranchAllocations = pgTable(
  "reward_branch_allocations",
  {
    rewardId: text("reward_id")
      .notNull()
      .references(() => rewards.id, { onDelete: "cascade" }),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "cascade" }),
    stockCount: integer("stock_count"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    pk: primaryKey({ columns: [t.rewardId, t.branchId] }),
    branchActiveIdx: index("reward_branch_allocations_branch_active_idx").on(t.branchId, t.active),
    rewardIdx: index("reward_branch_allocations_reward_idx").on(t.rewardId)
  })
);

export const transactions = pgTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    staffProfileId: text("staff_profile_id")
      .notNull()
      .references(() => staffProfiles.id, { onDelete: "restrict" }),
    branchId: text("branch_id").references(() => branches.id, { onDelete: "restrict" }),
    type: transactionType("type").notNull(),
    pointsDelta: integer("points_delta").notNull(),
    billTotalCents: integer("bill_total_cents"),
    rewardId: text("reward_id").references(() => rewards.id, { onDelete: "restrict" }),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({
    customerDateIdx: index("transactions_customer_date_idx").on(t.customerId, t.createdAt),
    branchDateIdx: index("transactions_branch_date_idx").on(t.branchId, t.createdAt),
    staffDateIdx: index("transactions_staff_date_idx").on(t.staffProfileId, t.createdAt),
    typeDateIdx: index("transactions_type_date_idx").on(t.type, t.createdAt),
    rewardIdx: index("transactions_reward_idx").on(t.rewardId)
  })
);

export const orgConfig = pgTable("org_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  valueType: orgConfigValueType("value_type").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

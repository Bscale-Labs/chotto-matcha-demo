import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { and, eq, inArray } from "drizzle-orm";
import { createHash } from "node:crypto";
import { db, schema } from "./client";
import {
  assets,
  branches,
  customers,
  orgConfig,
  rewardBranchAllocations,
  rewards,
  staffProfiles,
  staffRoleDetails,
  transactions,
  user,
  userRoles
} from "./schema";

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    cookiePrefix: "chotto-matcha"
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
  }
});

const DEMO_PASSWORD = "demopass123";

function isStaffSeedRole(role: string) {
  return role === "manager" || role === "cashier" || role === "branch_manager";
}

const demoUsers = [
  {
    email: "lesmon@bscalelabs.com",
    name: "Lesmon Saluta",
    staffProfileId: "staff-lesmon",
    customerId: "cust-lesmon",
    phone: "+63 917 000 0000",
    pointsBalance: 980,
    roles: ["manager", "customer"] as const
  },
  {
    email: "mika@chottomatcha.ph",
    name: "Mika Reyes",
    staffProfileId: "staff-mika",
    roles: ["cashier"] as const,
    branchId: "branch-bgc",
    pin: "1234"
  },
  {
    email: "ren@chottomatcha.ph",
    name: "Ren Cruz",
    staffProfileId: "staff-ren",
    roles: ["cashier"] as const,
    branchId: "branch-makati",
    pin: "5678"
  },
  {
    email: "lia@example.com",
    name: "Lia Tan",
    customerId: "cust-lia",
    phone: "+63 917 222 0147",
    pointsBalance: 1280,
    roles: ["customer"] as const
  },
  {
    email: "marco@example.com",
    name: "Marco Lim",
    customerId: "cust-marco",
    phone: "+63 905 882 1101",
    pointsBalance: 420,
    roles: ["customer"] as const
  },
  {
    email: "nina@example.com",
    name: "Nina Ong",
    customerId: "cust-nina",
    phone: "+63 998 441 2085",
    pointsBalance: 2460,
    roles: ["customer"] as const
  }
];

const demoBranches = [
  {
    id: "branch-bgc",
    code: "BGC",
    name: "BGC Matcha Bar",
    address: "High Street, Bonifacio Global City",
    googleMapsUrl: "https://maps.google.com/?q=High%20Street%20Bonifacio%20Global%20City",
    active: true
  },
  {
    id: "branch-makati",
    code: "MKT",
    name: "Makati Kiosk",
    address: "Legazpi Village, Makati",
    googleMapsUrl: "https://maps.google.com/?q=Legazpi%20Village%20Makati",
    active: true
  }
];

const demoAssets = [
  {
    id: "asset-org-logo",
    bucketKey: "org/logo.png",
    filename: "logo.png",
    contentType: "image/png",
    size: 84200,
    uploadedByStaffProfileId: "staff-lesmon",
    createdAt: new Date("2026-05-01T07:30:00.000Z")
  },
  {
    id: "asset-latte",
    bucketKey: "rewards/reward-latte/image.png",
    filename: "iced-matcha-latte.png",
    contentType: "image/png",
    size: 110400,
    uploadedByStaffProfileId: "staff-lesmon",
    createdAt: new Date("2026-05-02T05:12:00.000Z")
  }
];

const demoRewards = [
  {
    id: "reward-latte",
    name: "Iced Matcha Latte",
    description: "House matcha, oat milk, and a slow pour over ice.",
    imageAssetId: "asset-latte",
    pointCost: 350,
    type: "item" as const,
    stockCount: null,
    active: true
  },
  {
    id: "reward-cookie",
    name: "White Choco Cookie",
    description: "Soft cookie with matcha salt and white chocolate chunks.",
    imageAssetId: "asset-latte",
    pointCost: 240,
    type: "item" as const,
    stockCount: 18,
    active: true
  },
  {
    id: "reward-tin",
    name: "Ceremonial Tin",
    description: "Small-batch matcha tin for home whisking.",
    imageAssetId: "asset-latte",
    pointCost: 1600,
    type: "merch" as const,
    stockCount: 6,
    active: true
  },
  {
    id: "reward-tote",
    name: "Canvas Market Tote",
    description: "Heavy canvas tote with Chotto Matcha stamp artwork.",
    imageAssetId: "asset-latte",
    pointCost: 900,
    type: "merch" as const,
    stockCount: 0,
    active: true
  },
  {
    id: "reward-whisk",
    name: "Bamboo Whisk",
    description: "Classic chasen for smooth matcha at home.",
    imageAssetId: "asset-latte",
    pointCost: 1200,
    type: "merch" as const,
    stockCount: 4,
    active: true
  }
];

const demoRewardAllocations = [
  {
    rewardId: "reward-latte",
    branchId: "branch-bgc",
    stockCount: null,
    active: true
  },
  {
    rewardId: "reward-latte",
    branchId: "branch-makati",
    stockCount: null,
    active: true
  },
  {
    rewardId: "reward-cookie",
    branchId: "branch-bgc",
    stockCount: 18,
    active: true
  },
  {
    rewardId: "reward-cookie",
    branchId: "branch-makati",
    stockCount: 8,
    active: true
  },
  {
    rewardId: "reward-tin",
    branchId: "branch-bgc",
    stockCount: 6,
    active: true
  },
  {
    rewardId: "reward-tin",
    branchId: "branch-makati",
    stockCount: 2,
    active: true
  },
  {
    rewardId: "reward-tote",
    branchId: "branch-bgc",
    stockCount: 0,
    active: false
  },
  {
    rewardId: "reward-tote",
    branchId: "branch-makati",
    stockCount: 4,
    active: true
  },
  {
    rewardId: "reward-whisk",
    branchId: "branch-bgc",
    stockCount: 4,
    active: true
  },
  {
    rewardId: "reward-whisk",
    branchId: "branch-makati",
    stockCount: 0,
    active: false
  }
];

const demoTransactions = [
  {
    id: "txn-lia-opening",
    customerId: "cust-lia",
    staffProfileId: "staff-lesmon",
    branchId: null,
    type: "manual" as const,
    pointsDelta: 1210,
    reason: "Opening demo balance",
    createdAt: new Date("2026-05-06T08:00:00.000Z")
  },
  {
    id: "txn-001",
    customerId: "cust-lia",
    staffProfileId: "staff-mika",
    branchId: "branch-bgc",
    type: "earn" as const,
    pointsDelta: 420,
    billTotalCents: 42000,
    createdAt: new Date("2026-05-09T04:25:00.000Z")
  },
  {
    id: "txn-002",
    customerId: "cust-lia",
    staffProfileId: "staff-ren",
    branchId: "branch-makati",
    type: "redeem" as const,
    pointsDelta: -350,
    rewardId: "reward-latte",
    createdAt: new Date("2026-05-08T10:20:00.000Z")
  },
  {
    id: "txn-marco-opening",
    customerId: "cust-marco",
    staffProfileId: "staff-lesmon",
    branchId: null,
    type: "manual" as const,
    pointsDelta: 320,
    reason: "Opening demo balance",
    createdAt: new Date("2026-05-06T08:15:00.000Z")
  },
  {
    id: "txn-004",
    customerId: "cust-marco",
    staffProfileId: "staff-lesmon",
    branchId: null,
    type: "manual" as const,
    pointsDelta: 100,
    reason: "Opening demo adjustment",
    createdAt: new Date("2026-05-07T07:45:00.000Z")
  },
  {
    id: "txn-nina-opening",
    customerId: "cust-nina",
    staffProfileId: "staff-lesmon",
    branchId: null,
    type: "manual" as const,
    pointsDelta: 1700,
    reason: "Opening demo balance",
    createdAt: new Date("2026-05-06T08:30:00.000Z")
  },
  {
    id: "txn-003",
    customerId: "cust-nina",
    staffProfileId: "staff-mika",
    branchId: "branch-bgc",
    type: "earn" as const,
    pointsDelta: 760,
    billTotalCents: 76000,
    createdAt: new Date("2026-05-08T05:12:00.000Z")
  }
];

function hashDemoPin(pin: string) {
  return createHash("sha256").update(`chotto-demo:${pin}`).digest("hex");
}

function hasStaffProfile(
  demoUser: (typeof demoUsers)[number]
): demoUser is (typeof demoUsers)[number] & { staffProfileId: string } {
  return "staffProfileId" in demoUser && typeof demoUser.staffProfileId === "string";
}

function hasCustomerProfile(
  demoUser: (typeof demoUsers)[number]
): demoUser is (typeof demoUsers)[number] & {
  customerId: string;
  phone: string;
  pointsBalance: number;
} {
  return "customerId" in demoUser && typeof demoUser.customerId === "string";
}

async function ensureAuthUser(email: string, name: string) {
  let existing = await db.query.user.findFirst({ where: eq(user.email, email) });
  if (existing) return existing;

  console.log(`Creating demo auth user ${email}`);
  await auth.api.signUpEmail({
    body: { email, password: DEMO_PASSWORD, name }
  });

  existing = await db.query.user.findFirst({ where: eq(user.email, email) });
  if (!existing) throw new Error(`Auth user was not created for ${email}`);
  return existing;
}

async function reconcileStaffProfileId(authUserId: string, desiredStaffProfileId: string) {
  const existingByAuthUser = await db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.authUserId, authUserId)
  });
  if (!existingByAuthUser || existingByAuthUser.id === desiredStaffProfileId) return;

  const existingByDesiredId = await db.query.staffProfiles.findFirst({
    where: eq(staffProfiles.id, desiredStaffProfileId)
  });
  if (existingByDesiredId) {
    throw new Error(
      `Cannot seed ${desiredStaffProfileId}; it already belongs to another auth user`
    );
  }

  await db.delete(staffRoleDetails).where(eq(staffRoleDetails.staffProfileId, existingByAuthUser.id));
  await db
    .update(staffProfiles)
    .set({ id: desiredStaffProfileId, updatedAt: new Date() })
    .where(eq(staffProfiles.id, existingByAuthUser.id));
}

async function main() {
  for (const branch of demoBranches) {
    await db
      .insert(branches)
      .values(branch)
      .onConflictDoUpdate({
        target: branches.id,
        set: {
          code: branch.code,
          name: branch.name,
          address: branch.address,
          googleMapsUrl: branch.googleMapsUrl,
          active: branch.active,
          updatedAt: new Date()
        }
      });
  }

  for (const demoUser of demoUsers) {
    const authUser = await ensureAuthUser(demoUser.email, demoUser.name);

    for (const role of demoUser.roles) {
      await db.insert(userRoles).values({ authUserId: authUser.id, role }).onConflictDoNothing();
    }

    if (hasStaffProfile(demoUser)) {
      await reconcileStaffProfileId(authUser.id, demoUser.staffProfileId);

      await db
        .insert(staffProfiles)
        .values({
          id: demoUser.staffProfileId,
          authUserId: authUser.id,
          email: demoUser.email,
          name: demoUser.name,
          active: true
        })
        .onConflictDoUpdate({
          target: staffProfiles.id,
          set: {
            authUserId: authUser.id,
            email: demoUser.email,
            name: demoUser.name,
            active: true,
            updatedAt: new Date()
          }
        });

      for (const role of demoUser.roles) {
        if (isStaffSeedRole(role)) {
          await db
            .delete(staffRoleDetails)
            .where(eq(staffRoleDetails.staffProfileId, demoUser.staffProfileId));
          await db
            .delete(userRoles)
            .where(
              and(
                eq(userRoles.authUserId, authUser.id),
                inArray(userRoles.role, ["manager", "cashier", "branch_manager"])
              )
            );
          break;
        }
      }

      for (const role of demoUser.roles) {
        if (isStaffSeedRole(role)) {
          await db.insert(userRoles).values({ authUserId: authUser.id, role }).onConflictDoNothing();
          await db
            .insert(staffRoleDetails)
            .values({
              staffProfileId: demoUser.staffProfileId,
              role,
              branchId: "branchId" in demoUser ? demoUser.branchId : null,
              pinHash: "pin" in demoUser && demoUser.pin ? hashDemoPin(demoUser.pin) : null
            })
            .onConflictDoUpdate({
              target: [staffRoleDetails.staffProfileId, staffRoleDetails.role],
              set: {
                branchId: "branchId" in demoUser ? demoUser.branchId : null,
                pinHash: "pin" in demoUser && demoUser.pin ? hashDemoPin(demoUser.pin) : null,
                updatedAt: new Date()
              }
            });
        }
      }
    }

    if (hasCustomerProfile(demoUser)) {
      await db
        .insert(customers)
        .values({
          id: demoUser.customerId,
          authUserId: authUser.id,
          email: demoUser.email,
          name: demoUser.name,
          phone: demoUser.phone,
          pointsBalance: demoUser.pointsBalance,
          active: true
        })
        .onConflictDoUpdate({
          target: customers.id,
          set: {
            authUserId: authUser.id,
            email: demoUser.email,
            name: demoUser.name,
            phone: demoUser.phone,
            pointsBalance: demoUser.pointsBalance,
            active: true,
            updatedAt: new Date()
          }
        });
    }
  }

  for (const asset of demoAssets) {
    await db
      .insert(assets)
      .values(asset)
      .onConflictDoUpdate({
        target: assets.id,
        set: {
          bucketKey: asset.bucketKey,
          filename: asset.filename,
          contentType: asset.contentType,
          size: asset.size,
          uploadedByStaffProfileId: asset.uploadedByStaffProfileId
        }
      });
  }

  for (const reward of demoRewards) {
    await db
      .insert(rewards)
      .values(reward)
      .onConflictDoUpdate({
        target: rewards.id,
        set: { ...reward, updatedAt: new Date() }
      });
  }

  for (const allocation of demoRewardAllocations) {
    await db
      .insert(rewardBranchAllocations)
      .values(allocation)
      .onConflictDoUpdate({
        target: [rewardBranchAllocations.rewardId, rewardBranchAllocations.branchId],
        set: {
          stockCount: allocation.stockCount,
          active: allocation.active,
          updatedAt: new Date()
        }
      });
  }

  await db
    .insert(orgConfig)
    .values({ key: "earn_rate", value: "1", valueType: "number" })
    .onConflictDoUpdate({
      target: orgConfig.key,
      set: { value: "1", valueType: "number", updatedAt: new Date() }
    });

  await db
    .insert(orgConfig)
    .values({ key: "logo_asset_id", value: "asset-org-logo", valueType: "asset_id" })
    .onConflictDoUpdate({
      target: orgConfig.key,
      set: { value: "asset-org-logo", valueType: "asset_id", updatedAt: new Date() }
    });

  await db
    .insert(orgConfig)
    .values({ key: "org_name", value: "Chotto Matcha", valueType: "string" })
    .onConflictDoUpdate({
      target: orgConfig.key,
      set: { value: "Chotto Matcha", valueType: "string", updatedAt: new Date() }
    });

  for (const transaction of demoTransactions) {
    await db.insert(transactions).values(transaction).onConflictDoNothing();
  }

  console.log("Seed complete.");
  console.log(`Demo password for seeded auth users: ${DEMO_PASSWORD}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

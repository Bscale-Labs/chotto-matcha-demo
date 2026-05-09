import type { Asset, Branch, Customer, OrgConfig, Reward, Staff, Transaction } from "@/lib/types";

export const orgConfig: OrgConfig = {
  earnRate: 1,
  logoAssetId: "asset-org-logo"
};

export const branches: Branch[] = [
  {
    id: "branch-bgc",
    name: "BGC Matcha Bar",
    address: "High Street, Bonifacio Global City",
    active: true
  },
  {
    id: "branch-makati",
    name: "Makati Kiosk",
    address: "Legazpi Village, Makati",
    active: true
  }
];

export const staff: Staff[] = [
  {
    id: "staff-aya",
    email: "aya@chottomatcha.ph",
    name: "Aya Santos",
    role: "manager",
    pinSet: false,
    active: true
  },
  {
    id: "staff-mika",
    email: "mika@chottomatcha.ph",
    name: "Mika Reyes",
    role: "cashier",
    pinSet: true,
    branchId: "branch-bgc",
    active: true
  },
  {
    id: "staff-ren",
    email: "ren@chottomatcha.ph",
    name: "Ren Cruz",
    role: "cashier",
    pinSet: true,
    branchId: "branch-makati",
    active: true
  }
];

export const customers: Customer[] = [
  {
    id: "cust-lia",
    email: "lia@example.com",
    name: "Lia Tan",
    phone: "+63 917 222 0147",
    pointsBalance: 1280,
    createdAt: "2026-05-01T08:30:00.000Z"
  },
  {
    id: "cust-marco",
    email: "marco@example.com",
    name: "Marco Lim",
    phone: "+63 905 882 1101",
    pointsBalance: 420,
    createdAt: "2026-05-03T09:10:00.000Z"
  },
  {
    id: "cust-nina",
    email: "nina@example.com",
    name: "Nina Ong",
    phone: "+63 998 441 2085",
    pointsBalance: 2460,
    createdAt: "2026-05-05T03:40:00.000Z"
  }
];

export const assets: Asset[] = [
  {
    id: "asset-org-logo",
    bucketKey: "org/logo.png",
    filename: "logo.png",
    contentType: "image/png",
    size: 84200,
    uploadedBy: "staff-aya",
    createdAt: "2026-05-01T07:30:00.000Z"
  },
  {
    id: "asset-latte",
    bucketKey: "rewards/reward-latte/image.png",
    filename: "iced-matcha-latte.png",
    contentType: "image/png",
    size: 110400,
    uploadedBy: "staff-aya",
    createdAt: "2026-05-02T05:12:00.000Z"
  }
];

export const rewards: Reward[] = [
  {
    id: "reward-latte",
    name: "Iced Matcha Latte",
    description: "House matcha, oat milk, and a slow pour over ice.",
    imageAssetId: "asset-latte",
    pointCost: 350,
    type: "item",
    stockCount: null,
    active: true
  },
  {
    id: "reward-cookie",
    name: "White Choco Cookie",
    description: "Soft cookie with matcha salt and white chocolate chunks.",
    imageAssetId: "asset-latte",
    pointCost: 240,
    type: "item",
    stockCount: 18,
    active: true
  },
  {
    id: "reward-tin",
    name: "Ceremonial Tin",
    description: "Small-batch matcha tin for home whisking.",
    imageAssetId: "asset-latte",
    pointCost: 1600,
    type: "merch",
    stockCount: 6,
    active: true
  },
  {
    id: "reward-tote",
    name: "Canvas Market Tote",
    description: "Heavy canvas tote with Chotto Matcha stamp artwork.",
    imageAssetId: "asset-latte",
    pointCost: 900,
    type: "merch",
    stockCount: 0,
    active: true
  },
  {
    id: "reward-whisk",
    name: "Bamboo Whisk",
    description: "Classic chasen for smooth matcha at home.",
    imageAssetId: "asset-latte",
    pointCost: 1200,
    type: "merch",
    stockCount: 4,
    active: true
  }
];

export const transactions: Transaction[] = [
  {
    id: "txn-001",
    customerId: "cust-lia",
    staffId: "staff-mika",
    branchId: "branch-bgc",
    type: "earn",
    pointsDelta: 420,
    billTotal: 420,
    createdAt: "2026-05-09T04:25:00.000Z"
  },
  {
    id: "txn-002",
    customerId: "cust-lia",
    staffId: "staff-ren",
    branchId: "branch-makati",
    type: "redeem",
    pointsDelta: -350,
    rewardId: "reward-latte",
    createdAt: "2026-05-08T10:20:00.000Z"
  },
  {
    id: "txn-003",
    customerId: "cust-nina",
    staffId: "staff-mika",
    branchId: "branch-bgc",
    type: "earn",
    pointsDelta: 760,
    billTotal: 760,
    createdAt: "2026-05-08T05:12:00.000Z"
  },
  {
    id: "txn-004",
    customerId: "cust-marco",
    staffId: "staff-aya",
    branchId: null,
    type: "manual",
    pointsDelta: 100,
    reason: "Opening demo adjustment",
    createdAt: "2026-05-07T07:45:00.000Z"
  }
];

export function getCustomer(id = "cust-lia") {
  return customers.find((customer) => customer.id === id) ?? customers[0];
}

export function getReward(id: string) {
  return rewards.find((reward) => reward.id === id);
}

export function getBranch(id: string | null | undefined) {
  return branches.find((branch) => branch.id === id);
}

export function getStaff(id: string) {
  return staff.find((member) => member.id === id);
}

export function getCustomerTransactions(customerId: string) {
  return transactions.filter((transaction) => transaction.customerId === customerId);
}

export const dashboardStats = {
  activeCustomers: customers.length,
  pointsIssuedAllTime: transactions
    .filter((transaction) => transaction.pointsDelta > 0)
    .reduce((sum, transaction) => sum + transaction.pointsDelta, 0),
  pointsRedeemedAllTime: Math.abs(
    transactions
      .filter((transaction) => transaction.pointsDelta < 0)
      .reduce((sum, transaction) => sum + transaction.pointsDelta, 0)
  ),
  topRewards: rewards.slice(0, 3)
};

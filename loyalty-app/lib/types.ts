export type Role = "customer" | "cashier" | "manager";

export type Branch = {
  id: string;
  name: string;
  address: string;
  active: boolean;
};

export type Staff = {
  id: string;
  email: string;
  name: string;
  role: "cashier" | "manager";
  pinSet: boolean;
  branchId?: string;
  active: boolean;
};

export type Customer = {
  id: string;
  email: string;
  name: string;
  phone: string;
  pointsBalance: number;
  active?: boolean;
  createdAt: string | Date;
};

export type Asset = {
  id: string;
  bucketKey: string;
  filename: string;
  contentType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  imageAssetId: string | null;
  imageUrl?: string | null;
  pointCost: number;
  type: "item" | "merch";
  stockCount: number | null;
  active: boolean;
};

export type Transaction = {
  id: string;
  customerId: string;
  staffId: string;
  branchId: string | null;
  type: "earn" | "redeem" | "manual";
  pointsDelta: number;
  billTotal?: number;
  rewardId?: string;
  reason?: string;
  createdAt: string;
};

export type OrgConfig = {
  earnRate: number;
  logoAssetId: string;
};

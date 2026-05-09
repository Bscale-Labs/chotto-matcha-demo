export type StoredAsset = {
  key: string;
  url: string;
};

export function getAssetUrl(key: string) {
  return `/api/uploads/${encodeURIComponent(key)}`;
}

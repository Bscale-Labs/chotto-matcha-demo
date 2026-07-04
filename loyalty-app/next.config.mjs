/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Image uploads are capped at 5MB in the upload action
      // (maxImageSize in app/manager/actions.ts). Give the framework body
      // parser headroom above that so a valid 5MB file isn't rejected by
      // multipart overhead before the action's own check runs.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;

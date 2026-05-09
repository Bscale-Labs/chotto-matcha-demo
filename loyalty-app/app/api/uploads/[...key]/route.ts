import { getAssetObject } from "@/lib/storage";

export async function GET(_: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const bucketKey = key.join("/");
  if (!bucketKey) return new Response("Not found", { status: 404 });

  try {
    const object = await getAssetObject(bucketKey);
    if (!object.Body) return new Response("Not found", { status: 404 });

    const bytes = await object.Body.transformToByteArray();
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": object.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400"
      }
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

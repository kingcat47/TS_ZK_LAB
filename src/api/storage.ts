const WORKER_URL = import.meta.env.VITE_UPLOAD_WORKER_URL as string;
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN as string;

export async function uploadImage(file: File, path: string): Promise<string> {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${WORKER_URL}/${encodedPath}`, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "X-Admin-Token": ADMIN_TOKEN,
    },
    body: file,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

  const data = await res.json() as { url: string };
  return data.url;
}

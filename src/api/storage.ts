import { auth } from "./firebase";

const WORKER_URL = import.meta.env.VITE_UPLOAD_WORKER_URL as string;

export async function uploadImage(file: File, path: string): Promise<string> {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken) throw new Error("Not authenticated");

  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${WORKER_URL}/${encodedPath}`, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "Authorization": `Bearer ${idToken}`,
    },
    body: file,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

  const data = await res.json() as { url: string };
  return data.url;
}

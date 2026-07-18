import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { uploadImage } from "./storage";
import type { CardNewsFormData, PaperInput } from "@/types/admin";

export interface CardNewsSummary {
  id: string;
  title: string;
  category: string;
  published: boolean;
  thumbnail: string;
  createdAt: number;
}

export async function getCardNewsList(): Promise<CardNewsSummary[]> {
  const q = query(collection(db, "cardNews"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    title: d.data().title,
    category: d.data().category,
    published: d.data().published,
    thumbnail: d.data().thumbnail,
    createdAt: d.data().createdAt?.toMillis?.() ?? 0,
  }));
}

export async function deleteCardNews(id: string) {
  // 논문 서브컬렉션 삭제
  const papersSnap = await getDocs(collection(db, "cardNews", id, "papers"));
  await Promise.all(papersSnap.docs.map((d) => deleteDoc(d.ref)));
  // 카드뉴스 삭제
  await deleteDoc(doc(db, "cardNews", id));
}

export async function saveCardNews(form: CardNewsFormData) {
  const id = Date.now().toString();

  let thumbnailUrl = "";
  if (form.thumbnail) {
    thumbnailUrl = await uploadImage(form.thumbnail, `cardNews/${id}/thumbnail`);
  }

  const slideUrls = await Promise.all(
    form.slides.map((s, i) => uploadImage(s.file, `cardNews/${id}/slides/${i}`))
  );

  const cardNewsRef = await addDoc(collection(db, "cardNews"), {
    title: form.title,
    category: form.category,
    tags: form.tags,
    published: form.published,
    thumbnail: thumbnailUrl,
    slides: slideUrls,
    terms: form.terms,
    content: form.content,
    createdAt: serverTimestamp(),
  });

  await Promise.all(
    form.papers.map((paper: PaperInput) =>
      addDoc(collection(db, "cardNews", cardNewsRef.id, "papers"), paper)
    )
  );

  return cardNewsRef.id;
}

export async function updateCardNewsPublished(id: string, published: boolean) {
  await updateDoc(doc(db, "cardNews", id), { published });
}

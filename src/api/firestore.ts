import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { uploadImage } from "./storage";
import type { CardNewsFormData, PaperInput } from "@/types/admin";

export async function saveCardNews(form: CardNewsFormData) {
  const id = Date.now().toString();

  // 썸네일 업로드
  let thumbnailUrl = "";
  if (form.thumbnail) {
    thumbnailUrl = await uploadImage(form.thumbnail, `cardNews/${id}/thumbnail`);
  }

  // 슬라이드 업로드
  const slideUrls = await Promise.all(
    form.slides.map((s, i) => uploadImage(s.file, `cardNews/${id}/slides/${i}`))
  );

  // 카드뉴스 저장
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

  // 논문 저장
  await Promise.all(
    form.papers.map((paper: PaperInput) =>
      addDoc(collection(db, "papers"), {
        cardNewsId: cardNewsRef.id,
        ...paper,
      })
    )
  );

  return cardNewsRef.id;
}

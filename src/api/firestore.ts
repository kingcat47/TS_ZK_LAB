import {
  collection, addDoc, updateDoc, deleteDoc, setDoc,
  doc, getDocs, getDoc, query, orderBy, serverTimestamp,
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

export interface CardNewsItem {
  id: string;
  title: string;
  category: string;
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

export interface CardNewsWithPapers {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  papers: { type: string }[];
}

export async function getPublishedCardNewsWithPapers(): Promise<CardNewsWithPapers[]> {
  const q = query(collection(db, "cardNews"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const published = snap.docs.filter((d) => d.data().published);

  const results = await Promise.all(
    published.map(async (d) => {
      const papersSnap = await getDocs(collection(db, "cardNews", d.id, "papers"));
      return {
        id: d.id,
        title: d.data().title,
        category: d.data().category,
        thumbnail: d.data().thumbnail,
        papers: papersSnap.docs.map((p) => ({ type: p.data().type as string })),
      };
    })
  );

  return results.filter((r) => r.papers.length > 0);
}

export async function getPublishedCardNews(): Promise<CardNewsItem[]> {
  const q = query(
    collection(db, "cardNews"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs
    .filter((d) => d.data().published)
    .map((d) => ({
      id: d.id,
      title: d.data().title,
      category: d.data().category,
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
    form.slides.map((s, i) =>
      s.file ? uploadImage(s.file, `cardNews/${id}/slides/${i}`) : Promise.resolve(s.existingUrl ?? "")
    )
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

export interface BookmarksData {
  cardNews: (string | number)[];
  papers: (string | number)[];
}

export async function getBookmarks(uid: string): Promise<BookmarksData> {
  const snap = await getDoc(doc(db, "users", uid, "data", "bookmarks"));
  if (!snap.exists()) return { cardNews: [], papers: [] };
  const d = snap.data();
  return { cardNews: d.cardNews ?? [], papers: d.papers ?? [] };
}

export async function saveBookmarks(uid: string, bookmarks: BookmarksData): Promise<void> {
  await setDoc(doc(db, "users", uid, "data", "bookmarks"), bookmarks);
}

export async function getCardNewsForEdit(id: string) {
  const snap = await getDoc(doc(db, "cardNews", id));
  if (!snap.exists()) return null;
  const d = snap.data();
  const papersSnap = await getDocs(
    query(collection(db, "cardNews", id, "papers"), orderBy("order"))
  );
  return {
    id: snap.id,
    title: d.title as string,
    category: d.category as string,
    tags: (d.tags as string[]) ?? [],
    published: d.published as boolean,
    thumbnail: d.thumbnail as string,
    slides: (d.slides as string[]) ?? [],
    terms: d.terms ?? [],
    content: d.content ?? {},
    papers: papersSnap.docs.map((p) => p.data()),
  };
}

export async function updateCardNews(id: string, form: CardNewsFormData) {
  const thumbnailUrl = form.thumbnail
    ? await uploadImage(form.thumbnail, `cardNews/${id}/thumbnail_${Date.now()}`)
    : form.existingThumbnailUrl;

  const slideUrls = await Promise.all(
    form.slides.map((s, i) =>
      s.file
        ? uploadImage(s.file, `cardNews/${id}/slides/${Date.now()}_${i}`)
        : Promise.resolve(s.existingUrl ?? s.preview)
    )
  );

  await updateDoc(doc(db, "cardNews", id), {
    title: form.title,
    category: form.category,
    tags: form.tags,
    published: form.published,
    thumbnail: thumbnailUrl,
    slides: slideUrls,
    terms: form.terms,
    content: form.content,
  });

  // 논문은 논문 관리 탭에서 별도 관리 (form.papers가 있을 때만 업데이트)
  if (form.papers.length > 0) {
    const papersSnap = await getDocs(collection(db, "cardNews", id, "papers"));
    await Promise.all(papersSnap.docs.map((d) => deleteDoc(d.ref)));
    await Promise.all(
      form.papers.map((paper) =>
        addDoc(collection(db, "cardNews", id, "papers"), paper)
      )
    );
  }
}

export interface CardNewsDetail {
  id: string;
  title: string;
  category: string;
  slides: string[];
  terms: { word: string; description: string }[];
  content: object;
  papers: {
    id: string;
    order: number;
    type: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    url: string;
    summary: { heading: string; content: string }[];
  }[];
}

export async function getCardNewsDetail(id: string): Promise<CardNewsDetail | null> {
  const snap = await getDoc(doc(db, "cardNews", id));
  if (!snap.exists()) return null;

  const d = snap.data();
  const papersSnap = await getDocs(
    query(collection(db, "cardNews", id, "papers"), orderBy("order"))
  );

  return {
    id: snap.id,
    title: d.title,
    category: d.category,
    slides: d.slides ?? [],
    terms: d.terms ?? [],
    content: d.content ?? {},
    papers: papersSnap.docs.map((p) => ({ id: p.id, ...p.data() as object }) as CardNewsDetail["papers"][number]),
  };
}

// ── 독립 논문 컬렉션 ──────────────────────────────────────
export interface PaperDocData {
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  type: string;
  summary: { heading: string; content: string }[];
}

export interface PaperDocItem extends PaperDocData {
  id: string;
  createdAt: number;
}

export async function getPapersList(): Promise<PaperDocItem[]> {
  const q = query(collection(db, "papers"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    title: d.data().title as string,
    authors: d.data().authors as string,
    journal: d.data().journal as string,
    year: d.data().year as number,
    url: d.data().url as string,
    type: d.data().type as string,
    summary: (d.data().summary ?? []) as { heading: string; content: string }[],
    createdAt: d.data().createdAt?.toMillis?.() ?? 0,
  }));
}

export async function savePaperDoc(data: PaperDocData): Promise<string> {
  const ref = await addDoc(collection(db, "papers"), { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updatePaperDoc(id: string, data: PaperDocData): Promise<void> {
  await updateDoc(doc(db, "papers", id), { ...data });
}

export async function deletePaperDoc(id: string): Promise<void> {
  await deleteDoc(doc(db, "papers", id));
}

// ── 카드뉴스별 논문 직접 CRUD ──────────────────────────────
export interface StoredPaper {
  id: string;
  order: number;
  type: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  thumbnail?: string;
  content?: object;
  summary: { heading: string; content: string | object }[];
}

export async function getPapersForCardNews(cardNewsId: string): Promise<StoredPaper[]> {
  const q = query(collection(db, "cardNews", cardNewsId, "papers"), orderBy("order"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StoredPaper));
}

export async function addPaperToCardNews(
  cardNewsId: string,
  paper: Omit<StoredPaper, "id">
): Promise<void> {
  await addDoc(collection(db, "cardNews", cardNewsId, "papers"), paper);
}

export async function updatePaperInCardNews(
  cardNewsId: string,
  paperId: string,
  paper: Partial<Omit<StoredPaper, "id">>
): Promise<void> {
  await updateDoc(doc(db, "cardNews", cardNewsId, "papers", paperId), paper);
}

export async function deletePaperFromCardNews(cardNewsId: string, paperId: string): Promise<void> {
  await deleteDoc(doc(db, "cardNews", cardNewsId, "papers", paperId));
}

export interface PaperSearchItem {
  id: string;
  cardNewsId: string;
  order: number;
  type: "근본" | "발전" | "트렌드" | "한계";
  title: string;
  authors: string;
  journal: string;
}

export async function getPublishedPapersForSearch(): Promise<PaperSearchItem[]> {
  const q = query(collection(db, "cardNews"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const published = snap.docs.filter((d) => d.data().published);

  const results = await Promise.all(
    published.map(async (d) => {
      const papersSnap = await getDocs(
        query(collection(db, "cardNews", d.id, "papers"), orderBy("order"))
      );
      return papersSnap.docs.map((p) => ({
        id: p.id,
        cardNewsId: d.id,
        order: p.data().order as number,
        type: p.data().type as PaperSearchItem["type"],
        title: p.data().title as string,
        authors: p.data().authors as string,
        journal: p.data().journal as string,
      }));
    })
  );

  return results.flat();
}

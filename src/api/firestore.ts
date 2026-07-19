import {
  collection, addDoc, updateDoc, deleteDoc, setDoc,
  doc, getDocs, getDoc, query, orderBy, serverTimestamp, increment,
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

// ── Analytics ─────────────────────────────────────────────

export async function incrementCardNewsView(id: string): Promise<void> {
  await updateDoc(doc(db, "cardNews", id), { views: increment(1) });
}

export async function logAccess(uid: string | null): Promise<void> {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  await addDoc(collection(db, "accessLogs"), {
    uid,
    hour: now.getHours(),
    date,
    timestamp: serverTimestamp(),
  });
}

export async function upsertUserProfile(
  uid: string,
  email: string | null,
  displayName: string | null
): Promise<void> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      email: email ?? "",
      displayName: displayName ?? "",
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, { lastSeen: serverTimestamp() });
  }
}

export interface AnalyticsData {
  totalUsers: number;
  newUsersLast7Days: number;
  todayActiveUsers: number;
  weekActiveUsers: number;
  monthActiveUsers: number;
  hourlyAccess: number[];
  cardNewsStats: {
    id: string;
    title: string;
    category: string;
    views: number;
    bookmarkCount: number;
  }[];
  categoryStats: { category: string; count: number }[];
  recentUsers: { uid: string; email: string; displayName: string; createdAt: number }[];
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

  // 사용자
  const usersSnap = await getDocs(collection(db, "users"));
  const users = usersSnap.docs.map((d) => ({
    uid: d.id,
    email: d.data().email as string,
    displayName: d.data().displayName as string,
    createdAt: d.data().createdAt?.toMillis?.() ?? 0,
  }));
  const totalUsers = users.length;
  const newUsersLast7Days = users.filter((u) => u.createdAt >= sevenDaysAgo).length;
  const recentUsers = [...users].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

  // 접속 로그
  const logsSnap = await getDocs(collection(db, "accessLogs"));
  const logs = logsSnap.docs.map((d) => ({
    uid: d.data().uid as string | null,
    hour: d.data().hour as number,
    date: d.data().date as string,
    ts: d.data().timestamp?.toMillis?.() ?? 0,
  }));

  const todayLogs = logs.filter((l) => l.date === todayStr);
  const weekLogs = logs.filter((l) => l.ts >= sevenDaysAgo);
  const monthLogs = logs.filter((l) => l.ts >= thirtyDaysAgo);

  const countUnique = (arr: typeof logs) =>
    new Set(arr.map((l) => l.uid).filter(Boolean)).size;

  const todayActiveUsers = countUnique(todayLogs);
  const weekActiveUsers = countUnique(weekLogs);
  const monthActiveUsers = countUnique(monthLogs);

  const hourlyAccess = Array(24).fill(0) as number[];
  logs.forEach((l) => { hourlyAccess[l.hour]++; });

  // 카드뉴스
  const cnSnap = await getDocs(query(collection(db, "cardNews"), orderBy("createdAt", "desc")));
  const cardNewsItems = cnSnap.docs.map((d) => ({
    id: d.id,
    title: d.data().title as string,
    category: d.data().category as string,
    views: (d.data().views as number) ?? 0,
    bookmarkCount: 0,
  }));

  // 북마크 집계 (사용자별)
  const bookmarkMap: Record<string, number> = {};
  await Promise.all(
    usersSnap.docs.map(async (userDoc) => {
      const bmSnap = await getDoc(doc(db, "users", userDoc.id, "data", "bookmarks"));
      if (!bmSnap.exists()) return;
      const ids: (string | number)[] = bmSnap.data().cardNews ?? [];
      ids.forEach((id) => {
        const key = String(id);
        bookmarkMap[key] = (bookmarkMap[key] ?? 0) + 1;
      });
    })
  );

  const cardNewsStats = cardNewsItems.map((cn) => ({
    ...cn,
    bookmarkCount: bookmarkMap[cn.id] ?? 0,
  }));

  // 카테고리별 인기도
  const categoryMap: Record<string, number> = {};
  cardNewsStats.forEach((cn) => {
    categoryMap[cn.category] = (categoryMap[cn.category] ?? 0) + cn.views + cn.bookmarkCount;
  });
  const categoryStats = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalUsers,
    newUsersLast7Days,
    todayActiveUsers,
    weekActiveUsers,
    monthActiveUsers,
    hourlyAccess,
    cardNewsStats,
    categoryStats,
    recentUsers,
  };
}

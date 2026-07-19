import { useEffect, useState } from "react";

import { getCardNewsList, deleteCardNews, updateCardNewsPublished } from "@/api/firestore";
import type { CardNewsSummary } from "@/api/firestore";

import s from "./styles.module.scss";

interface PostListProps {
  onEdit: (id: string) => void;
}

export default function PostList({ onEdit }: PostListProps) {
  const [posts, setPosts] = useState<CardNewsSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCardNewsList()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 을(를) 삭제하시겠습니까?`)) return;
    await deleteCardNews(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleTogglePublished(id: string, current: boolean) {
    await updateCardNewsPublished(id, !current);
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !current } : p))
    );
  }

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>게시물 관리</h2>

      {loading ? (
        <p className={s.empty}>불러오는 중...</p>
      ) : posts.length === 0 ? (
        <p className={s.empty}>게시물이 없습니다.</p>
      ) : (
        <ul className={s.list}>
          {posts.map((post) => (
            <li key={post.id} className={s.item}>
              {post.thumbnail ? (
                <img src={post.thumbnail} alt="" className={s.thumb} />
              ) : (
                <div className={s.thumbPlaceholder} />
              )}

              <div className={s.info}>
                <div className={s.title}>{post.title}</div>
                <div className={s.meta}>
                  <span className={s.category}>{post.category}</span>
                  <span className={[s.badge, post.published ? s.published : s.draft].join(" ")}>
                    {post.published ? "공개" : "비공개"}
                  </span>
                </div>
              </div>

              <div className={s.actions}>
                <button
                  type="button"
                  className={s.toggleBtn}
                  onClick={() => handleTogglePublished(post.id, post.published)}
                >
                  {post.published ? "비공개로" : "공개로"}
                </button>
                <button
                  type="button"
                  className={s.editBtn}
                  onClick={() => onEdit(post.id)}
                >
                  수정
                </button>
                <button
                  type="button"
                  className={s.deleteBtn}
                  onClick={() => handleDelete(post.id, post.title)}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

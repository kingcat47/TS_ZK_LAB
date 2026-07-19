import { useEffect, useState } from "react";
import { Users, TrendingUp, Clock, Eye, Bookmark, BarChart2 } from "lucide-react";
import { getAnalyticsData } from "@/api/firestore";
import type { AnalyticsData } from "@/api/firestore";
import s from "./styles.module.scss";

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={s.loading}>데이터 불러오는 중...</div>;
  if (!data) return null;

  const maxHourly = Math.max(...data.hourlyAccess, 1);
  const top5 = [...data.cardNewsStats]
    .sort((a, b) => b.views + b.bookmarkCount - (a.views + a.bookmarkCount))
    .slice(0, 5);
  const maxCategory = Math.max(...data.categoryStats.map((c) => c.count), 1);

  return (
    <div className={s.wrapper}>

      {/* ── 사용자 현황 ── */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>사용자 현황</h2>
        <div className={s.statGrid}>
          <StatCard icon={<Users size={18} />} label="전체 가입자" value={data.totalUsers} unit="명" />
          <StatCard icon={<TrendingUp size={18} />} label="신규 가입 (7일)" value={data.newUsersLast7Days} unit="명" accent />
          <StatCard icon={<Clock size={18} />} label="오늘 활성 사용자" value={data.todayActiveUsers} unit="명" />
          <StatCard icon={<Clock size={18} />} label="주간 활성 사용자" value={data.weekActiveUsers} unit="명" />
          <StatCard icon={<Clock size={18} />} label="월간 활성 사용자" value={data.monthActiveUsers} unit="명" />
          <StatCard icon={<BarChart2 size={18} />} label="전체 카드뉴스" value={data.cardNewsStats.length} unit="개" />
        </div>
      </section>

      {/* ── 시간대별 접속 분포 ── */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>시간대별 접속 분포</h2>
        <div className={s.chartCard}>
          <div className={s.barChart}>
            {data.hourlyAccess.map((count, hour) => (
              <div key={hour} className={s.barCol}>
                <span className={s.barCount}>{count > 0 ? count : ""}</span>
                <div
                  className={s.bar}
                  style={{ height: `${Math.max((count / maxHourly) * 100, 2)}%` }}
                />
                <span className={s.barLabel}>{hour}시</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 콘텐츠 반응 ── */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>카드뉴스 반응</h2>
        <div className={s.tableCard}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>제목</th>
                <th>카테고리</th>
                <th><Eye size={13} /> 조회수</th>
                <th><Bookmark size={13} /> 북마크</th>
              </tr>
            </thead>
            <tbody>
              {data.cardNewsStats.map((cn) => (
                <tr key={cn.id}>
                  <td className={s.titleCell}>{cn.title}</td>
                  <td><span className={s.badge}>{cn.category}</span></td>
                  <td className={s.numCell}>{cn.views.toLocaleString()}</td>
                  <td className={s.numCell}>{cn.bookmarkCount.toLocaleString()}</td>
                </tr>
              ))}
              {data.cardNewsStats.length === 0 && (
                <tr><td colSpan={4} className={s.empty}>데이터 없음</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Top 5 ── */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>Top 5 인기 콘텐츠</h2>
        <div className={s.topList}>
          {top5.map((cn, i) => (
            <div key={cn.id} className={s.topRow}>
              <span className={s.rank}>{i + 1}</span>
              <span className={s.topTitle}>{cn.title}</span>
              <span className={s.topMeta}>
                <Eye size={12} /> {cn.views}
                <Bookmark size={12} style={{ marginLeft: 8 }} /> {cn.bookmarkCount}
              </span>
            </div>
          ))}
          {top5.length === 0 && <p className={s.empty}>데이터 없음</p>}
        </div>
      </section>

      {/* ── 카테고리별 인기도 ── */}
      {data.categoryStats.length > 0 && (
        <section className={s.section}>
          <h2 className={s.sectionTitle}>카테고리별 인기도</h2>
          <div className={s.chartCard}>
            <div className={s.categoryList}>
              {data.categoryStats.map((c) => (
                <div key={c.category} className={s.categoryRow}>
                  <span className={s.categoryName}>{c.category}</span>
                  <div className={s.categoryBarWrap}>
                    <div
                      className={s.categoryBar}
                      style={{ width: `${(c.count / maxCategory) * 100}%` }}
                    />
                  </div>
                  <span className={s.categoryCount}>{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 최근 가입자 ── */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>최근 가입자</h2>
        <div className={s.tableCard}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {data.recentUsers.map((u) => (
                <tr key={u.uid}>
                  <td>{u.displayName || "—"}</td>
                  <td className={s.emailCell}>{u.email || "—"}</td>
                  <td className={s.dateCell}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("ko-KR") : "—"}
                  </td>
                </tr>
              ))}
              {data.recentUsers.length === 0 && (
                <tr><td colSpan={3} className={s.empty}>데이터 없음</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon, label, value, unit, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div className={[s.statCard, accent ? s.accentCard : ""].join(" ")}>
      <div className={s.statIcon}>{icon}</div>
      <div className={s.statValue}>{value.toLocaleString()}<span className={s.statUnit}>{unit}</span></div>
      <div className={s.statLabel}>{label}</div>
    </div>
  );
}

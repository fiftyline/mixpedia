import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { endpoint } from "../../../config/config";
import MultiSelect from "../../../components/MultiSelect";

const fetchMediaMacro = () =>
  axios
    .post(`${endpoint}/get_media_macro/`, {})
    .then((res) => (Array.isArray(res.data) ? res.data : []));

const PAGE_SIZE = 10;

function getIndustries(item) {
  return Array.isArray(item.top_inds)
    ? item.top_inds
        .slice(0, 5)
        .map((i) => i.industry)
        .filter(Boolean)
    : [];
}

export default function MediaTable() {
  const navigate = useNavigate();
  const sentinelRef = useRef(null);
  const [filterMedia, setFilterMedia] = useState("");
  const [filterIndustry, setFilterIndustry] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const {
    data: allData = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["media-macro"],
    queryFn: fetchMediaMacro,
    staleTime: Infinity,
  });

  const error = isError ? "데이터를 불러오지 못했습니다." : null;

  const allIndustries = useMemo(() => {
    const set = new Set();
    allData.forEach((item) => {
      if (Array.isArray(item.top_inds)) {
        item.top_inds.forEach((i) => {
          if (i.industry) set.add(i.industry);
        });
      }
    });
    return [...set]
      .sort((a, b) => a.localeCompare(b))
      .map((industry) => ({ label: industry, value: industry }));
  }, [allData]);

  const filteredData = useMemo(() => {
    const query = filterMedia.trim().toLowerCase();
    return allData.filter((item) => {
      if (
        query &&
        !String(item.media ?? "")
          .toLowerCase()
          .includes(query)
      )
        return false;
      if (filterIndustry.length > 0) {
        const inds = Array.isArray(item.top_inds)
          ? item.top_inds.map((i) => i.industry)
          : [];
        if (!filterIndustry.some((industry) => inds.includes(industry)))
          return false;
      }
      return true;
    });
  }, [allData, filterMedia, filterIndustry]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= filteredData.length) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisibleCount((prev) =>
          Math.min(prev + PAGE_SIZE, filteredData.length),
        );
      },
      { rootMargin: "240px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredData.length, visibleCount]);

  const visibleData = filteredData.slice(0, visibleCount);
  const isFiltered = filterMedia.trim().length > 0 || filterIndustry.length > 0;

  return (
    <div className="media-table-wrap">
      <div className="media-table-header">
        <span className="media-table-title">매체 목록</span>
        <span className="media-table-hint">
          {loading
            ? "데이터 불러오는 중..."
            : (error ?? "카드를 클릭하면 상세 인사이트를 확인할 수 있습니다")}
        </span>
      </div>

      <div className="media-table-filter">
        <div className="mtf-item">
          <input
            className="mtf-input"
            type="text"
            placeholder="매체명 검색"
            value={filterMedia}
            onChange={(e) => {
              setFilterMedia(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          />
        </div>
        <div
          className={`mtf-item mtf-item--industry${
            filterIndustry.length > 0 ? " mtf-item--has-selection" : ""
          }`}
        >
          <MultiSelect
            options={allIndustries}
            value={filterIndustry}
            onChange={(value) => {
              setFilterIndustry(value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="업종 선택"
          />
        </div>
        {isFiltered && (
          <button
            className="mtf-reset"
            type="button"
            onClick={() => {
              setFilterMedia("");
              setFilterIndustry([]);
              setVisibleCount(PAGE_SIZE);
            }}
          >
            초기화
          </button>
        )}
        {!loading && !error && (
          <span className="mtf-count">
            {filteredData.length.toLocaleString()}개
          </span>
        )}
      </div>

      {error ? (
        <div className="state-msg state-msg--error">{error}</div>
      ) : loading ? (
        <div className="state-msg">매체 카드를 불러오는 중...</div>
      ) : visibleData.length === 0 ? (
        <div className="state-msg">조건에 맞는 매체가 없습니다.</div>
      ) : (
        <>
          <div className="media-card-grid">
            {visibleData.map((item) => {
              const logo_src = item.logo_src ?? null;
              const accent = item.accent ?? "#64748b";
              const soft = item.soft ?? "#f1f5f9";
              const industries = getIndustries(item);

              return (
                <button
                  key={item.media}
                  className="media-card"
                  type="button"
                  style={{ "--media-accent": accent, "--media-soft": soft }}
                  onClick={() =>
                    navigate(
                      `/media-insight/${encodeURIComponent(item.media_id ?? item.media)}`,
                      { state: { media: item } },
                    )
                  }
                >
                  <span className="media-card-top">
                    <span className="media-card-icon">
                      {logo_src ? (
                        <img src={logo_src} alt="" className="media-card-logo" />
                      ) : (
                        <Megaphone size={18} strokeWidth={2} />
                      )}
                    </span>
                    <ArrowUpRight
                      className="media-card-arrow"
                      size={15}
                      strokeWidth={2}
                    />
                  </span>
                  <span className="media-card-name">{item.media || "-"}</span>
                  <span className="media-card-metric">
                    <strong>
                      {Number(item.mix_cnt ?? 0).toLocaleString()}
                    </strong>
                    <small>개</small>
                    <small>믹스 포함</small>
                  </span>
                  <span className="media-card-industries">
                    {industries.length > 0 ? (
                      industries.map((ind) => (
                        <span key={ind} className="media-card-industry">
                          {ind}
                        </span>
                      ))
                    ) : (
                      <span className="media-card-industry media-card-industry--empty">
                        주요 업종 없음
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <div ref={sentinelRef} className="media-card-sentinel">
            {visibleCount < filteredData.length
              ? "더 불러오는 중..."
              : `${filteredData.length.toLocaleString()}개 매체를 모두 표시했습니다.`}
          </div>
        </>
      )}
    </div>
  );
}

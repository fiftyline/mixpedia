import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../config/config";
import { notify } from "../utils/notify";

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [pendingIds, setPendingIds] = useState(new Set());

  useEffect(() => {
    axios.post(`${endpoint}/bookmark/load`)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const ids = rows[0]?.mix_bookmark ?? [];
        setBookmarkedIds(new Set(ids.map(Number)));
      })
      .catch(() => {});
  }, []);

  const toggleBookmark = useCallback(async (fileId) => {
    const id = Number(fileId);
    if (pendingIds.has(id)) return false;

    const wasBookmarked = bookmarkedIds.has(id);
    setPendingIds((prev) => new Set([...prev, id]));

    try {
      if (wasBookmarked) {
        await axios.post(`${endpoint}/bookmark/remove`, { mix_ids: [id] });
        setBookmarkedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
        notify.success("북마크가 해제되었습니다.");
      } else {
        await axios.post(`${endpoint}/bookmark/add`, { mix_ids: [id] });
        setBookmarkedIds((prev) => new Set([...prev, id]));
        notify.success("북마크에 추가되었습니다.");
      }
      return true;
    } catch {
      notify.error("북마크 처리 중 오류가 발생했습니다.");
      return false;
    } finally {
      setPendingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    }
  }, [bookmarkedIds, pendingIds]);

  const bulkBookmark = useCallback(async (ids, action) => {
    const targets = ids.map(Number).filter((id) =>
      action === "add" ? !bookmarkedIds.has(id) : bookmarkedIds.has(id)
    );
    if (!targets.length) return;

    setPendingIds((prev) => new Set([...prev, ...targets]));
    try {
      await axios.post(`${endpoint}/bookmark/${action}`, { mix_ids: targets });
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (action === "add") targets.forEach((id) => next.add(id));
        else targets.forEach((id) => next.delete(id));
        return next;
      });
      const msg = action === "add"
        ? `${targets.length}건이 북마크에 추가되었습니다.`
        : `${targets.length}건의 북마크가 해제되었습니다.`;
      notify.success(msg);
    } catch {
      notify.error("북마크 처리 중 오류가 발생했습니다.");
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        targets.forEach((id) => next.delete(id));
        return next;
      });
    }
  }, [bookmarkedIds]);

  return (
    <BookmarkContext.Provider value={{ bookmarkedIds, pendingIds, toggleBookmark, bulkBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  return useContext(BookmarkContext);
}

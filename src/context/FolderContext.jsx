import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../config/config";
import { notify } from "../utils/notify";

const FolderContext = createContext(null);

export function FolderProvider({ children }) {
  const [folderIds, setFolderIds] = useState(new Set());
  const [pendingIds, setPendingIds] = useState(new Set());

  useEffect(() => {
    axios
      .post(`${endpoint}/bookmark/load`)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const ids = rows[0]?.mix_bookmark ?? [];
        setFolderIds(new Set(ids.map(Number)));
      })
      .catch(() => {});
  }, []);

  const toggleFolder = useCallback(
    async (fileId) => {
      const id = Number(fileId);
      if (pendingIds.has(id)) return false;

      const wasInFolder = folderIds.has(id);
      setPendingIds((prev) => new Set([...prev, id]));

      try {
        if (wasInFolder) {
          await axios.post(`${endpoint}/bookmark/remove`, { mix_ids: [id] });
          setFolderIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          notify.success("폴더에서 제거했습니다.");
        } else {
          await axios.post(`${endpoint}/bookmark/add`, { mix_ids: [id] });
          setFolderIds((prev) => new Set([...prev, id]));
          notify.success("폴더에 추가했습니다.");
        }
        return true;
      } catch {
        notify.error("폴더 처리 중 오류가 발생했습니다.");
        return false;
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [folderIds, pendingIds],
  );

  const bulkFolder = useCallback(
    async (ids, action) => {
      const targets = ids
        .map(Number)
        .filter((id) =>
          action === "add" ? !folderIds.has(id) : folderIds.has(id),
        );
      if (!targets.length) return;

      setPendingIds((prev) => new Set([...prev, ...targets]));
      try {
        await axios.post(`${endpoint}/bookmark/${action}`, { mix_ids: targets });
        setFolderIds((prev) => {
          const next = new Set(prev);
          if (action === "add") targets.forEach((id) => next.add(id));
          else targets.forEach((id) => next.delete(id));
          return next;
        });
        notify.success(
          action === "add"
            ? `${targets.length}건을 폴더에 추가했습니다.`
            : `${targets.length}건을 폴더에서 제거했습니다.`,
        );
      } catch {
        notify.error("폴더 처리 중 오류가 발생했습니다.");
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          targets.forEach((id) => next.delete(id));
          return next;
        });
      }
    },
    [folderIds],
  );

  return (
    <FolderContext.Provider value={{ folderIds, pendingIds, toggleFolder, bulkFolder }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolder() {
  return useContext(FolderContext);
}

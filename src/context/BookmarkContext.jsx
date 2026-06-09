import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../config/config";

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [foldersLoading, setFoldersLoading] = useState(true);

  const refreshFolders = useCallback(() => {
    setFoldersLoading(true);
    axios
      .post(`${endpoint}/bookmark/load`)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setFolders(rows);
        const allIds = rows.flatMap((f) => Array.isArray(f.file_ids) ? f.file_ids : []);
        setBookmarkedIds(new Set(allIds.map(Number)));
      })
      .catch(() => { setFolders([]); setBookmarkedIds(new Set()); })
      .finally(() => setFoldersLoading(false));
  }, []);

  useEffect(() => {
    refreshFolders();
  }, [refreshFolders]);

  return (
    <BookmarkContext.Provider value={{ folders, bookmarkedIds, foldersLoading, refreshFolders }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  return useContext(BookmarkContext);
}

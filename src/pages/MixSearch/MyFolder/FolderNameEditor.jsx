import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../config/config";
import { notify } from "../../../utils/notify";

export default function FolderNameEditor({ folder, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(folder.folder_name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === folder.folder_name) { setEditing(false); return; }
    setSaving(true);
    try {
      await axios.post(`${endpoint}/bookmark/edit`, {
        folder_id: folder.folder_id,
        new_folder_name: trimmed,
      });
      notify.success("폴더 이름이 변경되었습니다.");
      onSaved(trimmed);
      setEditing(false);
    } catch {
      notify.error("이름 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <span className="folder-detail-name-wrap">
        <span className="folder-detail-name">{value}</span>
        <button
          className="folder-name-edit-btn"
          title="이름 변경"
          onClick={() => setEditing(true)}
        >
          <Pencil size={13} strokeWidth={2} />
        </button>
      </span>
    );
  }

  return (
    <span className="folder-detail-name-wrap">
      <input
        className="folder-name-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
        autoFocus
        disabled={saving}
      />
      <button className="folder-name-edit-btn" onClick={handleSave} disabled={saving}>
        <Check size={13} strokeWidth={2} />
      </button>
      <button className="folder-name-edit-btn" onClick={() => { setValue(folder.folder_name); setEditing(false); }}>
        <X size={13} strokeWidth={2} />
      </button>
    </span>
  );
}

import { useState, useCallback } from "react";
import SearchPanel from "./components/SearchPanel";
import MixTable from "./components/MixTable";
import { useMixSearch } from "./hooks/useMixSearch";
import "./styles.css";

export default function MixSearchPage() {
  const [selectedMix, setSelectedMix] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const {
    filters,
    setFilters,
    results,
    loading,
    mediaOptions,
    industryOptions,
    handleSearch,
    handleReset,
  } = useMixSearch();

  const handleSelect = useCallback(
    (item) => {
      const fid = item?.file_id;
      if (fid != null && String(fid) === String(selectedRowId)) {
        setSelectedMix(null);
        setSelectedRowId(null);
      } else {
        setSelectedMix(item);
        setSelectedRowId(fid ?? null);
      }
    },
    [selectedRowId],
  );

  return (
    <section className="mix-search-page">
      <div className="page-header">
        <h1 className="page-title">미디어믹스 조회</h1>
        <p className="page-desc">캠페인들의 미디어믹스를 조회합니다.</p>
      </div>

      <SearchPanel
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
        mediaOptions={mediaOptions}
        industryOptions={industryOptions}
      />

      <MixTable
        results={results}
        onSelect={handleSelect}
        selectedMix={selectedMix}
        selectedRowId={selectedRowId}
      />
    </section>
  );
}

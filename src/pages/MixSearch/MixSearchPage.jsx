import { useState } from "react";
import SearchPanel from "./components/SearchPanel";
import MixTable from "./components/MixTable";
import MixDetail from "./components/detail/MixDetail";
import { useMixSearch } from "./hooks/useMixSearch";
import "./styles.css";

export default function MixSearchPage() {
  const [selectedMix, setSelectedMix] = useState(null);
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

  return (
    <section className="mix-search-page">
      {selectedMix ? (
        <MixDetail
          mix={selectedMix}
          onBack={() => setSelectedMix(null)}
          onSelect={setSelectedMix}
        />
      ) : (
        <>
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

          <MixTable results={results} onSelect={setSelectedMix} />
        </>
      )}
    </section>
  );
}

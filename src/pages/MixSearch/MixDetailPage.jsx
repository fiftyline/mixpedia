import { useMemo } from "react";
import { useParams } from "react-router-dom";
import MixDetail from "./components/detail/MixDetail";
import "./styles.css";

const STORAGE_PREFIX = "mixpedia:mix-detail:";

function readMix(fileId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${fileId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function MixDetailPage() {
  const { file_id: fileId } = useParams();
  const mix = useMemo(() => readMix(fileId), [fileId]);

  if (!mix) {
    return (
      <section className="mix-search-page">
        <div className="state-msg state-msg--error">
          상세 정보를 불러올 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="mix-search-page">
      <MixDetail
        mix={mix}
        onBack={() => window.close()}
        onSelect={(item) => {
          localStorage.setItem(
            `${STORAGE_PREFIX}${item.file_id}`,
            JSON.stringify(item),
          );
          window.open(
            `/mix-search/detail/${item.file_id}`,
            "_blank",
            "noopener",
          );
        }}
      />
    </section>
  );
}

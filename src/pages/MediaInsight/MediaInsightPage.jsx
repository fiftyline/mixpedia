import { useState } from "react";
import MediaTable from "./components/MediaTable";
import MediaDetail from "./components/MediaDetail";
import MixDetail from "../MixSearch/components/detail/MixDetail";
import "./styles.css";

export default function MediaInsightPage() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedMix, setSelectedMix] = useState(null);

  if (selectedMix) {
    return (
      <section className="media-insight-page">
        <MixDetail
          mix={selectedMix}
          onBack={() => setSelectedMix(null)}
          onSelect={setSelectedMix}
        />
      </section>
    );
  }

  return (
    <section className="media-insight-page">
      {selectedMedia ? (
        <MediaDetail
          media={selectedMedia}
          onBack={() => setSelectedMedia(null)}
          onSelectMix={setSelectedMix}
        />
      ) : (
        <>
          <div className="page-header">
            <h1 className="page-title">매체 인사이트</h1>
            <p className="page-desc">
              매체를 선택하여 사용 현황과 인사이트를 확인합니다.
            </p>
          </div>
          <MediaTable onSelect={setSelectedMedia} />
        </>
      )}
      <br />
    </section>
  );
}

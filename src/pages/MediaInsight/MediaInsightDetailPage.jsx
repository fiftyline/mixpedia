import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { endpoint } from "../../config/config";
import MediaDetail from "./components/MediaDetail";
import MixDetail from "../MixSearch/components/detail/MixDetail";
import "./styles.css";

const fetchMediaMacro = () =>
  axios
    .post(`${endpoint}/get_media_macro/`, {})
    .then((res) => (Array.isArray(res.data) ? res.data : []));

export default function MediaInsightDetailPage() {
  const { mediaId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMix, setSelectedMix] = useState(null);

  const stateMedia = location.state?.media ?? null;

  const { data: allData = [], isLoading } = useQuery({
    queryKey: ["media-macro"],
    queryFn: fetchMediaMacro,
    staleTime: Infinity,
    enabled: !stateMedia,
  });

  const media =
    stateMedia ??
    allData.find(
      (m) =>
        encodeURIComponent(m.media_id ?? m.media) === mediaId,
    ) ??
    null;

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

  if (!stateMedia && isLoading) {
    return (
      <section className="media-insight-page">
        <div className="state-msg">불러오는 중...</div>
      </section>
    );
  }

  if (!media) {
    return (
      <section className="media-insight-page">
        <div className="state-msg state-msg--error">매체를 찾을 수 없습니다.</div>
      </section>
    );
  }

  return (
    <section className="media-insight-page">
      <MediaDetail
        media={media}
        onBack={() => navigate("/media-insight")}
        onSelectMix={setSelectedMix}
      />
      <br />
    </section>
  );
}

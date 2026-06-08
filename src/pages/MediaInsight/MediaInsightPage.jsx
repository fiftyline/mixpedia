import MediaTable from "./components/MediaTable";
import "./styles.css";

export default function MediaInsightPage() {
  return (
    <section className="media-insight-page">
      <div className="page-header">
        <h1 className="page-title">매체 인사이트</h1>
        <p className="page-desc">
          매체를 선택하여 사용 현황과 인사이트를 확인합니다.
        </p>
      </div>
      <MediaTable />
      <br />
    </section>
  );
}

export default function Alerts({ alerts, onDismiss }) {
  if (!alerts.length) return null;
  return (
    <div className="mmm-alerts">
      {alerts.map((a) => (
        <div key={a.id} className={`mmm-alert mmm-alert--${a.type}`}>
          <span dangerouslySetInnerHTML={{ __html: a.message }} />
          <button onClick={() => onDismiss(a.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

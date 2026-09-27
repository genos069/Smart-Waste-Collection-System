export default function RequestState({ loading, error, onRetry }) {
  if (error) return <div className="request-message error-message" role="alert"><span>{error}</span>{onRetry && <button type="button" className="secondary-button" onClick={onRetry}>Retry</button>}</div>;
  if (loading) return <div className="request-message" role="status">Loading live data…</div>;
  return null;
}

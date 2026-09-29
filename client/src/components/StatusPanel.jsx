
export default function StatusPanel({
  distanceToTarget,
  eta,
  steps,
  nextStep,
  currentTarget,
  canPickup,
  isProcessing,
  onAction
}) {

  return (
    <div className="panel">
      <h2>🚚 Garbage Tracker</h2>

      <div className="card">
        <p className="label">Next Target</p>
        <p className="value">
          {currentTarget ? currentTarget.name : "Completed"}
        </p>
      </div>

      <div className="card">
        <p className="label">Distance</p>
        <p className="value">
          {distanceToTarget !== null && distanceToTarget !== undefined
            ? `${distanceToTarget.toFixed(1)} m`
            : "—"}
        </p>
      </div>

      <div className="card">
        <p className="label">ETA</p>
        <p className="value">
          {eta !== null && eta !== undefined ? `${eta} mins` : "—"}
        </p>
      </div>

      <div className="card">
        {canPickup && currentTarget ? (
          <button className="btn" onClick={onAction} disabled={isProcessing}>
            {isProcessing
              ? "Processing..."
              : currentTarget?.type === "warehouse"
                ? "Drop at Dumpyard 🚮"
                : currentTarget?.type === "home"
                  ? "Complete trip at BMC"
                  : "Pick garbage 🧹"}
          </button>
        ) : (
          <p className="subtle">
            {currentTarget
              ? "Reach location to enable action"
              : "No pending tasks"}
          </p>
        )}
      </div>

      <div className="card">
        <p className="label">Next Step</p>
        <p className="value">
          {nextStep ? nextStep.instruction : "—"}
        </p>
      </div>

      <div className="card">
        <p className="label">Directions</p>
        <ul style={{ maxHeight: "200px", overflow: "auto" }}>
          {steps?.slice(0, 8).map((s, i) => (
            <li key={i}>
              ➤ {s.instruction} ({Math.round(s.distance)}m)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
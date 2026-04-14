import { useState } from "react";

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

  const [isDropped, setIsDropped] = useState(false);

  const handleClick = () => {
    if (currentTarget?.id === "warehouse") {
      setIsDropped(true);
      setTimeout(() => {
        setIsDropped(false);
      }, 10000);
    }

    onAction();
  };

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
          {distanceToTarget
            ? `${distanceToTarget.toFixed(1)} m`
            : "—"}
        </p>
      </div>

      <div className="card">
        <p className="label">ETA</p>
        <p className="value">
          {eta ? `${eta} mins` : "—"}
        </p>
      </div>

      <div className="card">
        {canPickup && currentTarget ? (
          <button className="btn" onClick={handleClick} disabled={isProcessing}>
            {isProcessing
              ? "Processing..."
              : currentTarget?.id === "warehouse"
                ? isDropped
                  ? "Done ✅"
                  : "Drop at Dumpyard 🚮"
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
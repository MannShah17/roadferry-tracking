import { XCircleIcon } from "./Icons";

export default function NotFoundScreen() {
  return (
    <div className="state-screen">
      <div className="terminal-badge cancelled">
        <XCircleIcon size={36} />
      </div>
      <p className="state-text">We couldn&apos;t find this order.</p>
      <p className="state-subtext">Check the tracking link and try again.</p>
    </div>
  );
}

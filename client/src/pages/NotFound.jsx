import { Link } from "react-router-dom";
export default function NotFound() {
  return <main className="auth-page"><section className="auth-card">
    <p className="eyebrow">404 · Page not found</p><h1>This page is unavailable</h1>
    <p>Check the address or return to the home page.</p><Link to="/">Go back home</Link>
  </section></main>;
}

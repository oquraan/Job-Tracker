import "./css/NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Oops! Page Not Found</p>
      <p className="description">
        The page you're looking for doesn't exist or has been moved. Please
        check the URL or navigate back to the homepage.
      </p>
      <a href="/">Go to Homepage</a>
    </div>
  );
}

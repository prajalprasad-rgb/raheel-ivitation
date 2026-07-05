import React from "react";
import { warnDeveloper } from "../../utils/logger";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    warnDeveloper("[Invitation ErrorBoundary]", { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-fallback" role="alert">
          <div className="panel center-panel">
            <p className="eyebrow">Invitation</p>
            <h1>Something went wrong</h1>
            <p className="muted">Please refresh the invitation to continue.</p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

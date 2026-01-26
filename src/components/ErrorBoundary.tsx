import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: any): State {
    return { hasError: true, message: err?.message || String(err) };
  }

  componentDidCatch(error: any, info: any) {
    // This prints the real error in console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>App crashed on load</h1>
          <p style={{ marginTop: 12 }}>
            <b>Error:</b> {this.state.message}
          </p>
          <p style={{ marginTop: 12 }}>
            Open DevTools → Console and paste the red error here.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

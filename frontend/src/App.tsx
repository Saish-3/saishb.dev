import { Component, ErrorInfo, ReactNode, useEffect } from "react";
import "lenis/dist/lenis.css";
import Descent from "./components/Descent";
import Marquee from "./components/Marquee";
import MatchFilm from "./components/MatchFilm";
import OffThePitch from "./components/OffThePitch";
import NextFixture from "./components/NextFixture";
import Footer from "./components/Footer";
import { destroyLenis, initLenis } from "./lib/lenis";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(_err: Error, info: ErrorInfo) {
    console.error("Boundary caught:", info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "40vh 24px 0", textAlign: "center", color: "#F2F2EA" }}>
          <p className="mono">HALF-TIME. SOMETHING BROKE — PLEASE RELOAD.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  return (
    <ErrorBoundary>
      <div className="app">
        <a className="skip-to-content mono" href="#match-film">
          SKIP TO CONTENT
        </a>
        <main>
          <Descent />
          <MatchFilm />
          <OffThePitch />
          <Marquee />
          <NextFixture />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

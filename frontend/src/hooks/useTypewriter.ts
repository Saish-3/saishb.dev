import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 28, startDelay = 150) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    let iv: number | undefined;
    const t = window.setTimeout(() => {
      iv = window.setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          window.clearInterval(iv);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(t);
      if (iv) window.clearInterval(iv);
    };
  }, [text, speed, startDelay]);
  const complete = () => {
    setDisplayed(text);
    setDone(true);
  };
  return { displayed, done, complete };
}

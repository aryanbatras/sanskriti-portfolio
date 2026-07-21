"use client";

import { useState, useCallback } from "react";
import LoaderScreen from "./LoaderScreen";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  const handleFinish = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <LoaderScreen onFinish={handleFinish} />}
      <div>{children}</div>
    </>
  );
}

import { App, KonstaProvider } from "konsta/react";
import { PropsWithChildren } from "react";

export default function KonstaLayouts({ children }: PropsWithChildren) {
  return (
    <KonstaProvider>
      <App safeAreas theme='ios'>
        {children}
      </App>
    </KonstaProvider>
  );
}

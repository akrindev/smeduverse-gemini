import { App, KonstaProvider } from "konsta/react";
import { PropsWithChildren } from "react";

export default function KonstaLayouts({ children }: PropsWithChildren) {
  return (
    <KonstaProvider theme='ios'>
      <App safeAreas theme='ios' className='k-ios'>
        {children}
      </App>
    </KonstaProvider>
  );
}

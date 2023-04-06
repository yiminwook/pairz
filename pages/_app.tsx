import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Observe from "@/components/common/observe";
import "@/styles/globals.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <RecoilRoot>
        <Observe>
          <Component {...pageProps} />
        </Observe>
      </RecoilRoot>
    </>
  );
};

export default App;

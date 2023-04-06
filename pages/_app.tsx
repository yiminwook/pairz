import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Observe from "@/components/common/observe";
import "@/styles/globals.scss";
import ToastList from "@/components/common/toast/toast_list";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <RecoilRoot>
        <Observe>
          <Component {...pageProps} />
          <ToastList />
        </Observe>
      </RecoilRoot>
    </>
  );
};

export default App;

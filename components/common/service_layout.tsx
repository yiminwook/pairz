import Head from "next/head";
import GNB from "./GNB";

interface Props {
  title?: string;
  showGNB: boolean;
  children: React.ReactNode;
}

const ServiceLayout = ({ title = "Pairz!", children, showGNB }: Props) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      {showGNB && <GNB />}
      {children}
    </div>
  );
};

export default ServiceLayout;

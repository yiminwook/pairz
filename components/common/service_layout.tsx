import Head from "next/head";
import GNB from "./GNB";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const ServiceLayout = ({ title = "Pairz!", children }: Props) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <GNB />
      {children}
    </div>
  );
};

export default ServiceLayout;

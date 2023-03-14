import Head from "next/head";
import ImgUpload from "./img_upload";

interface Props {
  title: string;
  children: React.ReactNode;
}

const ServiceLayout = ({ title = "Pairz!", children }: Props) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://img.icons8.com/external-vectorslab-flat-vectorslab/53/null/external-cards-travel-and-tour-camping-and-navigation-vectorslab-flat-vectorslab.png"
        />
      </Head>
      <ImgUpload />
      {children}
    </div>
  );
};

export default ServiceLayout;

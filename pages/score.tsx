import ServiceLayout from "@/components/service_layout";
import { GetStaticProps, NextPage } from "next";

interface Props {
  uid: string;
  score: number;
  time: string;
}

const ScorePage: NextPage = () => {
  return (
    <ServiceLayout title="Pairz Score Page">
      <></>
    </ServiceLayout>
  );
};

export default ScorePage;

const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      uid: "",
      score: 0,
      time: "",
    },
    revalidate: 30,
  };
};

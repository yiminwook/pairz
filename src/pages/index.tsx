import styles from "@/styles/Home.module.scss";
import ServiceLayout from "@/components/service_layout";
import { NextPage } from "next";

const IndexPage: NextPage = () => {
  return (
    <ServiceLayout title="test">
      <main>
        <div>
          <p>Get started pairz!</p>
        </div>
      </main>
    </ServiceLayout>
  );
};
export default IndexPage;

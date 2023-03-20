import home from "@/styles/Home.module.scss";
import ServiceLayout from "../components/service_layout";
import { NextPage } from "next";
import Card from "@/components/card";

const IndexPage: NextPage = () => {
  return (
    <ServiceLayout title="test">
      <main>
        <div>
          <p>Get started pairz!</p>
          <div>
            <button className={home.white}>button</button>
            <button className={home.blue}>button</button>
            <button className={home.green}>button</button>
            <button className={home.orange}>button</button>
            <button className={home.red}>button</button>
          </div>
          <Card
            isPreView={true}
            imgURL="https://pairs-img-bucket-2.s3.ap-northeast-2.amazonaws.com/%EB%AA%A8%EB%B0%94%EC%9D%BC%ED%85%8C%EC%8A%A4%ED%8A%B8"
          />
        </div>
      </main>
    </ServiceLayout>
  );
};
export default IndexPage;

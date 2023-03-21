import home from "@/styles/Home.module.scss";
import ServiceLayout from "../components/service_layout";
import { NextPage } from "next";
import Card from "@/components/card";
import Link from "next/link";

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
        </div>
        <Link href="/game" style={{ fontSize: "3rem" }}>
          Game Start
        </Link>
      </main>
    </ServiceLayout>
  );
};
export default IndexPage;

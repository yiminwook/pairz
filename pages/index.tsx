import home from "@/styles/home.module.scss";
import ServiceLayout from "../components/service_layout";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

const IndexPage: NextPage = () => {
  return (
    <ServiceLayout title="Pairz HOME">
      <main className={home.main}>
        <div className={home.container}>
          <div className={home.icon_container}>
            <Image
              className={home.icon}
              src="/home_icon.png"
              width={96}
              height={96}
              alt="home_icon"
              priority
            ></Image>
          </div>
          <Link href="/game" className={home.game_button}>
            Game Start!
          </Link>
          <p className={home.sub_title}>Get Started Pairz</p>
        </div>
      </main>
    </ServiceLayout>
  );
};
export default IndexPage;

import ServiceLayout from "@/components/common/service_layout";
import GridSection from "@/components/showcase/grid_section";
import Head from "@/components/showcase/head";
import imageModel from "@/models/image/image.model";
import { ImageInfo } from "@/models/Info";
import { isLoadingAtom } from "@/recoil/atoms";
import showcase from "@/styles/showcase/showcase.module.scss";
import { getBaseURL } from "@/utils/get_base_url";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps, NextPage } from "next";
import { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

type getImageResult = Awaited<ReturnType<typeof imageModel.get>>;
type findByImgNameResult = Awaited<ReturnType<typeof imageModel.findByImgName>>;
interface ImageSearchElements extends HTMLFormControlsCollection {
  image_search__input: HTMLInputElement;
  image_search__button: HTMLButtonElement;
}
export interface ImageSearch extends HTMLFormElement {
  readonly elements: ImageSearchElements;
}

/** default 이미지 이름으로 조회*/
const ShowcasePage: NextPage<getImageResult> = ({ imageData, lastIdx }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nameValue, setNameValue] = useState<string>("");
  const [reqImgData, setReqImgData] = useState<ImageInfo[]>([...imageData]);

  //페이지네이션용
  const [reqDataLength, setReqDataLength] = useState<number>(imageData.length);
  const [reqLastIdx, setReqLastIdx] = useState<number>(lastIdx);
  const [reqLastName, setReqLastName] =
    useState<findByImgNameResult["lastName"]>(null);

  const setLoading = useSetRecoilState(isLoadingAtom);

  /** 검색 bool이 true일 경우 더보기 */
  const findData = async (name: string, bool: boolean) => {
    try {
      setLoading(() => true);
      const result: AxiosResponse<findByImgNameResult> = await axios.get(
        `/api/image.find?name=${name}&next=${bool}`
      );
      const { imageData, lastName } = result.data;
      setReqImgData((pre) => {
        return bool ? [...pre, ...imageData] : [...imageData];
      });
      //페이지네이션
      setReqDataLength((_pre) => imageData.length);
      setReqLastName(() => lastName);

      setLoading(() => false);
    } catch (err) {
      console.error(err);
      setLoading(() => false);
    }
  };

  /** true일때 더보기 */
  const handleFindData = async (name: string, bool: boolean) => {
    if (bool === false) {
      setNameValue(() => name);
    }
    await findData(name, bool);
  };

  /** 최신순 검색 */
  const handleGetData = async () => {
    try {
      setLoading((_pre) => true);
      const result: AxiosResponse<getImageResult> = await axios.get(
        `/api/image.get?idx=${reqLastIdx ? reqLastIdx - 1 : ""}`
      );

      const { imageData, lastIdx } = result.data;
      setReqImgData((pre) => [...pre, ...imageData]);

      //페이지네이션
      setReqDataLength((_pre) => imageData.length);
      setReqLastIdx((_pre) => lastIdx);

      setLoading((_pre) => false);
    } catch (err) {
      console.error(err);
      setLoading((_pre) => false);
    }
  };

  /** 리셋 */
  const handleImgSearchReset = () => {
    setReqImgData((_pre) => [...imageData]);

    //페이지네이션
    setReqDataLength((_pre) => imageData.length);
    setReqLastIdx((_pre) => lastIdx);
    setReqLastName((_pre) => null);

    setNameValue((_pre) => "");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <ServiceLayout title="pairz SHOWCASE">
      <main className={showcase["container"]}>
        <section className={showcase["content"]}>
          <section className={showcase["head"]}>
            <Head
              inputRef={inputRef}
              nameValue={nameValue}
              handleImgSearchReset={handleImgSearchReset}
              handleFindData={handleFindData}
            />
          </section>
          <section className={showcase["grid"]}>
            <GridSection
              reqImgData={reqImgData}
              reqDataLength={reqDataLength}
              reqLastName={reqLastName}
              nameValue={nameValue}
              handleGetData={handleGetData}
              handleFindData={handleFindData}
            />
          </section>
        </section>
      </main>
    </ServiceLayout>
  );
};

export default ShowcasePage;

export const getStaticProps: GetStaticProps<getImageResult> = async () => {
  try {
    const baseURL = getBaseURL(true);
    const result: AxiosResponse<getImageResult> = await axios.get(
      `${baseURL}/api/image.get`
    );

    return {
      props: {
        ...result.data,
      },
      revalidate: 30,
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        imageData: [],
        lastIdx: 0,
      },
      revalidate: 30,
    };
  }
};

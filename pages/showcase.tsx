/* eslint-disable @next/next/no-img-element */
import { GetStaticProps, NextPage } from "next";
import { FormEvent } from "react";
import ServiceLayout from "@/components/common/service_layout";
import imageModel from "@/models/image/image.model";
import { ImageInfo } from "@/models/Info";
import axios, { AxiosResponse } from "axios";
import { useRef, useState } from "react";
import showcase from "@/styles/showcase.module.scss";
import { useSetRecoilState } from "recoil";
import { isLoadingAtom } from "@/recoil/atoms";
import { getBaseURL } from "@/utils/get_base_url";
import RenderImage from "@/components/showcase/render_image";
import InputText from "@/components/common/input_text";

type getImageResult = Awaited<ReturnType<typeof imageModel.get>>;
type findByImgNameResult = Awaited<ReturnType<typeof imageModel.findByImgName>>;
interface ImageSearchElements extends HTMLFormControlsCollection {
  image_search__input: HTMLInputElement;
  image_search__button: HTMLButtonElement;
}
interface ImageSearch extends HTMLFormElement {
  readonly elements: ImageSearchElements;
}

/** default 이미지 이름으로 조회*/
const ShowcasePage: NextPage<getImageResult> = ({ imageData, lastIdx }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nameValue, setNameValue] = useState<string>("");
  const [reqImageData, setReqImageData] = useState<ImageInfo[]>([...imageData]);

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
      setReqImageData((pre) => {
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
      setReqImageData((pre) => [...pre, ...imageData]);

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
    setReqImageData((_pre) => [...imageData]);

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
          <form
            className={showcase["head"]}
            onSubmit={(e: FormEvent<ImageSearch>) => {
              e.preventDefault();
              const inputValue = inputRef.current?.value;
              if (!inputValue) {
                // 입력값이 없을시 리셋
                handleImgSearchReset();
                return;
              }
              handleFindData(inputValue, false);
            }}
          >
            <div className={showcase["head__top"]}>
              <h2 className={showcase["title"]}>
                {nameValue.length > 0 ? `검색결과 ${nameValue}` : "최신순"}
              </h2>
            </div>
            <div className={showcase["head__buttom"]}>
              <div className={showcase["input"]}>
                <InputText inputRef={inputRef} placeholder="검색" />
              </div>
              <div className={showcase["button__container"]}>
                <div className={showcase["search"]}>
                  <button className={showcase["search__button"]} type="submit">
                    검색
                  </button>
                </div>
                <div className={showcase["reset"]}>
                  <button
                    className={showcase["reset__button"]}
                    onClick={handleImgSearchReset}
                    type="button"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
          <article className={showcase["grid__container"]}>
            <div className={showcase["grid"]}>
              {reqImageData &&
                reqImageData.map((data) => {
                  const { id, imgURL, imageName } = data;
                  return (
                    <RenderImage
                      key={id}
                      id={id}
                      imgURL={imgURL}
                      imageName={imageName}
                    />
                  );
                })}
              {/* 검색결과가 5이하이면 더보기가 보이지 않음 */}
              {reqDataLength >= 5 && (
                <div className={showcase["more"]}>
                  <button
                    className={showcase["more__button"]}
                    onClick={() => {
                      nameValue === "" || reqLastName === null
                        ? handleGetData()
                        : handleFindData(reqLastName, true);
                    }}
                  >
                    more
                  </button>
                </div>
              )}
            </div>
          </article>
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

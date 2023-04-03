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

type getImageResult = Awaited<ReturnType<typeof imageModel.get>>;
type findByImgTitleResult = Awaited<
  ReturnType<typeof imageModel.findByImgTitle>
>;
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
  const [title, setTitle] = useState<string>("");
  const [reqImageData, setReqImageData] = useState<ImageInfo[]>([...imageData]);

  //페이지네이션용
  const [reqDataLength, setReqDataLength] = useState<number>(imageData.length);
  const [reqLastIdx, setReqLastIdx] = useState<number>(lastIdx);
  const [reqLastTitle, setReqLastTitle] =
    useState<findByImgTitleResult["lastTitle"]>(null);

  const setLoading = useSetRecoilState(isLoadingAtom);

  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);

  /** 검색 bool이 true일 경우 더보기 */
  const find = async (title: string, bool: boolean) => {
    try {
      setLoading(() => true);
      const result: AxiosResponse<findByImgTitleResult> = await axios.get(
        `/api/image.find?title=${title}&next=${bool}`
      );
      const { imageData, lastTitle } = result.data;
      setReqImageData((pre) => {
        return bool ? [...pre, ...imageData] : [...imageData];
      });
      //페이지네이션
      setReqDataLength((_pre) => imageData.length);
      setReqLastTitle(() => lastTitle);

      setLoading(() => false);
    } catch (err) {
      console.error(err);
      setLoading(() => false);
    }
  };

  const handleFindData = async (title: string, bool: boolean) => {
    if (bool === false) {
      setTitle(() => title);
    }
    await find(title, bool);
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

    setReqDataLength((_pre) => imageData.length);
    setReqLastIdx((_pre) => lastIdx);
    setReqLastTitle((_pre) => null);

    setTitle((_pre) => "");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <ServiceLayout title="pairz SHOWCASE">
      <main className={showcase.container}>
        <form
          name="image_search__form"
          onSubmit={(e: FormEvent<ImageSearch>) => {
            e.preventDefault();
            const title = inputRef.current?.value;
            if (!title) {
              // 입력값이 없을시 리셋
              handleImgSearchReset();
              return;
            }
            handleFindData(title, false);
          }}
        >
          <input name="image_search__input" type="text" ref={inputRef} />

          <button name="image_search__button" type="submit">
            검색
          </button>
          <button onClick={handleImgSearchReset} type="button">
            Reset
          </button>
        </form>
        <div>{title.length > 0 ? `${title} 검색결과` : "최신순"}</div>
        <div className={showcase.main}>
          <div className={showcase.contents}>
            {reqImageData &&
              reqImageData.map((data) => (
                <div key={data.id}>
                  <div className={showcase.contents_image_container}>
                    {failToGetImage ? (
                      <img
                        src="/loading_icon.png"
                        width={200}
                        height={300}
                        alt="card_img_err"
                      />
                    ) : (
                      <img
                        src={data.imgURL}
                        width={200}
                        height={300}
                        alt="card_img"
                        onError={() => setFailToGetImage((_pre) => true)}
                      />
                    )}
                  </div>
                  <div className={showcase.contents_name}>{data.imageName}</div>
                  <div className={showcase.contents_id}>{data.id}</div>
                </div>
              ))}
            {/* 검색결과가 5이하이면 더보기가 보이지 않음 */}
            {reqDataLength >= 5 && (
              <button
                onClick={() => {
                  title === "" || reqLastTitle === null
                    ? handleGetData()
                    : handleFindData(reqLastTitle, true);
                }}
              >
                더보기
              </button>
            )}
          </div>
        </div>
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

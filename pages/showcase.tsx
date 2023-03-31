/* eslint-disable @next/next/no-img-element */
import { GetStaticProps, NextPage } from "next";
import { FormEvent } from "react";
import ServiceLayout from "@/components/common/service_layout";
import imageModel from "@/models/image/image.model";
import { ImageInfo } from "@/models/Info";
import axios, { AxiosResponse } from "axios";
import { useRef, useState } from "react";
import imageSearch from "@/styles/img_search.module.scss";
import { useSetRecoilState } from "recoil";
import { isLoadingAtom } from "@/recoil/atoms";
import { getBaseURL } from "@/utils/get_base_url";

type getImageResult = Awaited<ReturnType<typeof imageModel.get>>;
interface ImageSearchElements extends HTMLFormControlsCollection {
  image_search__select: HTMLSelectElement;
  image_search__input: HTMLInputElement;
  image_search__button: HTMLButtonElement;
}
interface ImageSearch extends HTMLFormElement {
  readonly elements: ImageSearchElements;
}

/** default 이미지 이름으로 조회*/
const ShowcasePage: NextPage<getImageResult> = ({ imageData, lastIdx }) => {
  const [failToGetImage, setFailToGetImage] = useState<boolean>(false);
  const [reqImageData, setReqImageData] = useState<ImageInfo[]>(imageData);
  const [reqLastIdx, setReqLastIdx] = useState<number>(lastIdx);
  const formRef = useRef<ImageSearch>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const setLoading = useSetRecoilState(isLoadingAtom);

  const handleSubmit = (e: FormEvent<ImageSearch>) => {
    e.preventDefault();
  };

  const getData = async () => {
    try {
      setLoading((_pre) => true);
      const result: AxiosResponse<getImageResult> = await axios.get(
        "/api/image.get"
      );
      const { imageData, lastIdx } = result.data;
      if (!(result.status === 200 && lastIdx >= 0))
        throw new Error("axios err");
      setReqImageData((_pre) => [...imageData]);
      setReqLastIdx((_pre) => lastIdx);
      setLoading((_pre) => false);
    } catch (err) {
      console.error(err);
      setLoading((_pre) => false);
    }
  };

  const handleGetData = async () => {
    try {
      setLoading((_pre) => true);
      const result: AxiosResponse<getImageResult> = await axios.get(
        `/api/image.get?idx=${reqLastIdx ? reqLastIdx - 1 : ""}`
      );

      const { imageData, lastIdx } = result.data;
      if (!(result.status === 200 && lastIdx >= 0))
        throw new Error("axios err");
      setReqImageData((pre) => [...pre, ...imageData]);
      setReqLastIdx((_pre) => lastIdx);
      setLoading((_pre) => false);
    } catch (err) {
      console.error(err);
      setLoading((_pre) => false);
    }
  };

  const handleImageSearchReset = () => {
    getData();
  };

  return (
    <ServiceLayout title="pairz SHOWCASE">
      <main className={imageSearch.container}>
        <form name="image_search__form" onSubmit={handleSubmit}>
          <select name="image_search__Select" ref={selectRef}>
            <optgroup label="검색필터">
              <option value="imageName">이미지명</option>
              <option value="email">이메일</option>
            </optgroup>
          </select>
          <input name="image_search__input" type="text" ref={inputRef} />
          <button name="image_search__button" type="submit">
            검색
          </button>
        </form>
        <button onClick={() => handleImageSearchReset()}>Reset</button>
        <div className={imageSearch.main}>
          <div className={imageSearch.contents}>
            {reqImageData &&
              reqImageData.map((data) => (
                <div key={data.id}>
                  <div className={imageSearch.contents_image_container}>
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
                  <div className={imageSearch.contents_name}>
                    {data.imageName}
                  </div>
                  <div className={imageSearch.contents_id}>{data.id}</div>
                </div>
              ))}
            {reqLastIdx >= 5 && <button onClick={handleGetData}>더보기</button>}
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

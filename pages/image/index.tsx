import ServiceLayout from "@/components/service_layout";
import { ImageResultWithIdx } from "@/models/image/image.model";
import { ImageInfo } from "@/models/Info";
import { getBaseURL } from "@/utils/get_base_url";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { useRef, useState } from "react";
import imageSearch from "@/styles/img_search.module.scss";
import { FormEvent } from "react";

interface Props {
  staticImageData: ImageInfo[];
  staticTotal: number;
  staticLastIdx: number | null;
}

interface ImageSearchElements extends HTMLFormControlsCollection {
  image_search__select: HTMLSelectElement;
  image_search__input: HTMLInputElement;
  image_search__button: HTMLButtonElement;
}

interface ImageSearch extends HTMLFormElement {
  readonly elements: ImageSearchElements;
}

/** default 이미지 이름으로 조회*/
const ImageSearchPage: NextPage<Props> = ({
  staticImageData,
  staticTotal,
  staticLastIdx,
}) => {
  const [failToGetImage, setFailToGetImage] = useState(false);
  const [reqImageData, setReqImageData] = useState([...staticImageData]);
  const [lastIdx, setLastIdx] = useState(staticLastIdx);
  const [total, setTotal] = useState(staticTotal);
  const formRef = useRef<ImageSearch>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleSubmit = (e: FormEvent<ImageSearch>) => {
    e.preventDefault();
  };

  const handleGetData = async () => {
    try {
      console.log(`/api/image.get?idx=${lastIdx}`);
      const result: AxiosResponse<ImageResultWithIdx> = await axios.get(
        `/api/image.get?idx=${lastIdx ? lastIdx - 1 : ""}`
      );
      const data = result.data;
      setReqImageData((pre) => [...pre, ...data.imageData]);
      setTotal((_pre) => data.total);
      setLastIdx((_pre) => data.lastIdx);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageSearchReset = () => {
    if (selectRef.current) {
      selectRef.current.value = "imageName";
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setReqImageData((pre) => staticImageData);
    setTotal((_pre) => staticTotal);
    setLastIdx((_pre) => staticLastIdx);
  };

  return (
    <ServiceLayout title="test">
      <main>
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
                    <Image
                      src={data.imgURL}
                      width={200}
                      height={300}
                      alt="card_img"
                      onError={() => setFailToGetImage((_pre) => true)}
                    ></Image>
                  </div>
                  <div className={imageSearch.contents_name}>
                    {data.imageName}
                  </div>
                  <div className={imageSearch.contents_id}>{data.id}</div>
                </div>
              ))}
            {total >= 5 && <button onClick={handleGetData}>더보기</button>}
          </div>
        </div>
      </main>
    </ServiceLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const baseURL = getBaseURL(true);
    const result: AxiosResponse<ImageResultWithIdx> = await axios.get(
      baseURL + "/api/image.get"
    );
    if (result.status !== 200) {
      return {
        props: { staticImageData: [], staticTotal: 0, staticLastIdx: null },
        revalidate: 30,
      };
    }
    const { imageData, total, lastIdx } = result.data;
    return {
      props: {
        staticImageData: imageData,
        staticTotal: total,
        staticLastIdx: lastIdx,
      },
      revalidate: 30,
    };
  } catch (err) {
    console.error(err);
    return {
      props: { staticImageData: [], staticTotal: 0, staticLastIdx: null },
      revalidate: 30,
    };
  }
};

export default ImageSearchPage;

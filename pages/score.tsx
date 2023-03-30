import ServiceLayout from "@/components/common/service_layout";
import { scoreResult } from "@/models/score/score.model";
import { getBaseURL } from "@/utils/get_base_url";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps, NextPage } from "next";
import score from "@/styles/score.module.scss";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { isLoadingAtom } from "@/recoil/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";

const ScorePage: NextPage<scoreResult> = ({ scoreData, lastIdx = 0 }) => {
  const [reqLastIdx, setReqLastIdx] = useState<number>(lastIdx);
  const [reqScoreData, setReqScoreData] =
    useState<scoreResult["scoreData"]>(scoreData);
  const setIsLoading = useSetRecoilState(isLoadingAtom);

  const getScore = async () => {
    try {
      setIsLoading((_pre) => true);
      const getScoreResult: AxiosResponse<scoreResult> = await axios.get(
        `/api/score?idx=${reqLastIdx - 1}`
      );
      const { status, data } = getScoreResult;
      if (status === 200 && data.scoreData.length >= 0) {
        setReqScoreData((pre) => [...pre, ...data.scoreData]);
        setReqLastIdx((_pre) => data.lastIdx ?? 0);
      }
      setIsLoading((_pre) => false);
    } catch (err) {
      console.error(err);
      setIsLoading((_pre) => false);
    }
  };

  const renderRank = (idx: number) => {
    let content: string;
    switch (idx) {
      case 0:
        content = "#ffdf3d";
        break;
      case 1:
        content = "#e5e5e5";
        break;
      case 2:
        content = "#b87333";
        break;
      default:
        content = "";
        break;
    }
    if (content === "") {
      return idx + 1;
    } else {
      return (
        <FontAwesomeIcon
          icon={faTrophy}
          style={{ color: content, width: "2rem", marginTop: "0.5rem" }}
        />
      );
    }
  };

  return (
    <ServiceLayout title="Pairz Score Page" showGNB={true}>
      <div className={score["container"]}>
        <div className={score["table__container"]}>
          <table>
            <thead>
              <tr>
                <th colSpan={1}>Rank</th>
                <th colSpan={1}>Score</th>
                <th colSpan={1}>Name</th>
                <th colSpan={1}>Time</th>
              </tr>
            </thead>
            <tbody>
              {reqScoreData.map((data, idx) => {
                return (
                  <tr key={data.id}>
                    <td colSpan={1}>{renderRank(idx)}</td>
                    <td colSpan={1}>{data.score}</td>
                    <td colSpan={1}>{data.displayName}</td>
                    <td colSpan={1}>{data.korTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className={score["more"]}>
          {reqLastIdx > 0 && (
            <button className={score["more__button"]} onClick={getScore}>
              more
            </button>
          )}
        </div>
      </div>
    </ServiceLayout>
  );
};

export default ScorePage;

export const getStaticProps: GetStaticProps<scoreResult> = async () => {
  try {
    const baseURL = getBaseURL(true);
    const getScoreResult: AxiosResponse<scoreResult> = await axios.get(
      `${baseURL}/api/score`
    );

    const { status, data } = getScoreResult;

    if (status == 200 && data.scoreData.length > 0) {
      return {
        props: {
          scoreData: data.scoreData,
          total: data.total,
          lastIdx: data.lastIdx,
        },
        revalidate: 30,
      };
    }

    return {
      props: {
        scoreData: [],
        total: 0,
        lastIdx: 0,
      },
      revalidate: 30,
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        scoreData: [],
        total: 0,
        lastIdx: 0,
      },
      revalidate: 30,
    };
  }
};

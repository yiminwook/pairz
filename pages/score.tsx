import ServiceLayout from '@/components/common/service_layout';
import { getBaseURL } from '@/utils/get_base_url';
import axios, { AxiosResponse } from 'axios';
import { GetStaticProps, NextPage } from 'next';
import score from '@/styles/score/score.module.scss';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { isLoadingAtom } from '@/recoil/atoms';
import { ParsedScoreInfo } from '@/models/Info';
import scoreModel from '@/models/score/score.model';
import RenderRank from '@/components/score/render_rank';

type getScoreResult = Awaited<ReturnType<typeof scoreModel.get>>;

const ScorePage: NextPage<getScoreResult> = ({ scoreData, lastIdx = 0 }) => {
  const [reqLastIdx, setReqLastIdx] = useState<number>(lastIdx);
  const [reqScoreData, setReqScoreData] = useState<ParsedScoreInfo[]>(scoreData);
  const setIsLoading = useSetRecoilState(isLoadingAtom);

  const getScore = async () => {
    try {
      setIsLoading((_pre) => true);
      const getScoreResult: AxiosResponse<getScoreResult> = await axios.get(`/api/score.get?idx=${reqLastIdx - 1}`);
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

  return (
    <ServiceLayout title="Pairz SCORE">
      <section className={score['score']}>
        <div className={score['contents']}>
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
                    <td colSpan={1}>
                      <RenderRank idx={idx} />
                    </td>
                    <td colSpan={1}>{data.score}</td>
                    <td colSpan={1}>{data.displayName}</td>
                    <td colSpan={1}>{data.korTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {reqLastIdx > 0 ? (
          <div className={score['more']}>
            <button onClick={getScore}>more</button>
          </div>
        ) : null}
      </section>
    </ServiceLayout>
  );
};

export default ScorePage;

export const getStaticProps: GetStaticProps<getScoreResult> = async () => {
  try {
    const baseURL = getBaseURL(true);
    const getScoreResult: AxiosResponse<getScoreResult> = await axios.get(`${baseURL}/api/score.get`);

    return {
      props: {
        ...getScoreResult.data,
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

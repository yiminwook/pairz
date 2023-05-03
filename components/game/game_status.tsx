import status from '@/styles/game/status.module.scss';
import Life from '@/components/game/life';

interface Props {
  time: number;
  round: number;
  score: number;
  life: number;
  countPause: number;
  handlePause: (bool: boolean) => void;
}

const GameStatus = ({ time, round, score, life, countPause, handlePause }: Props) => {
  return (
    <section className={status['status']}>
      <table>
        <thead>
          <tr>
            <th>
              <h3>round</h3>
            </th>
            <th>
              <h3>남은시간</h3>
            </th>
            <th>
              <h3>score</h3>
            </th>
            <th className={status['life']}>
              <h3>life</h3>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{round >= 0 && round + 1}</th>
            <th>{time} 초</th>
            <th>{score} 점</th>
            <th className={status['life']}>
              <Life life={life} />
            </th>
          </tr>
        </tbody>
      </table>
      <div className={status['pause']}>
        <div>
          <h2>남은횟수</h2>
          <span>{Math.ceil(countPause / 2)}</span>
        </div>
        <button onClick={() => handlePause(true)}>pause</button>
      </div>
    </section>
  );
};

export default GameStatus;

import status from "@/styles/game/status.module.scss";
import Life from "./life";

interface Props {
  time: number;
  round: number;
  score: number;
  life: number;
  countPause: number;
  handlePause: (bool: boolean) => void;
}

const GameStatus = ({
  time,
  round,
  score,
  life,
  countPause,
  handlePause,
}: Props) => {
  return (
    <div className={status["container"]}>
      <table className={status["status"]}>
        <thead className={status["status__head"]}>
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
            <th className={status["status__life"]}>
              <h3>life</h3>
            </th>
          </tr>
        </thead>
        <tbody className={status["status__body"]}>
          <tr>
            <th className={status["status__round"]}>
              {round >= 0 && round + 1}
            </th>
            <th className={status["status__time"]}>{time} 초</th>
            <th className={status["status__score"]}>{score} 점</th>
            <th className={status["status__life"]}>
              <Life life={life} />
            </th>
          </tr>
        </tbody>
      </table>
      <div className={status["pause"]}>
        <div className={status["pause__desc"]}>
          <h2>남은횟수</h2>
          <span>{Math.ceil(countPause / 2)}</span>
        </div>
        <button
          className={status["pause__button"]}
          onClick={() => handlePause(true)}
        >
          pause
        </button>
      </div>
    </div>
  );
};

export default GameStatus;

import { FC } from "react";
import pause from "@/styles/game/pause.module.scss";

interface Props {
  countPause: number;
  handlePause: (bool: boolean) => void;
}

const Pause: FC<Props> = ({ countPause, handlePause }) => {
  return (
    <div className={pause.pause_modal}>
      <div
        className={pause.pause_modal_backdrop}
        onClick={() => handlePause(false)}
      ></div>
      <div className={pause.pause_modal_container}>
        <div className={pause.pause_title}>pause</div>
        <p className={pause.pause_modal_desc}>
          {countPause <= 0
            ? "더이상 pause 할 수 없습니다."
            : `앞으로 ${Math.ceil(countPause / 2)}회 pause가 가능합니다.`}
        </p>
        <button
          className={pause.pause_close_button}
          onClick={() => handlePause(false)}
        >
          해제
        </button>
      </div>
    </div>
  );
};

export default Pause;

import GridItem from "./grid_item";
import grid from "@/styles/showcase/grid.module.scss";
import { ImageInfo } from "@/models/Info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface Props {
  reqImgData: ImageInfo[];
  reqDataLength: number;
  reqLastName: string | null;
  nameValue: string;
  handleGetData: () => void;
  handleFindData: (reqLastName: string, bool: true) => void;
}

const GridSection = ({
  reqImgData,
  reqDataLength,
  reqLastName,
  nameValue,
  handleGetData,
  handleFindData,
}: Props) => {
  return (
    <div className={grid["grid__container"]}>
      <div className={grid["grid"]}>
        {reqImgData.map((data) => {
          const { id, imgURL, imageName } = data;
          return (
            <GridItem key={id} id={id} imgURL={imgURL} imageName={imageName} />
          );
        })}
        {/* 검색결과가 5이하이면 더보기가 보이지 않음 */}
        {reqDataLength >= 5 ? (
          <div className={grid["more"]}>
            <button
              className={grid["more__button"]}
              onClick={() => {
                nameValue === "" || reqLastName === null
                  ? handleGetData()
                  : handleFindData(reqLastName, true);
              }}
            >
              <FontAwesomeIcon
                icon={faCaretDown}
                style={{ color: "#f0ffff", width: "3rem", height: "3rem" }}
              />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default GridSection;

import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  idx: number;
}

const RenderRank = ({ idx }: Props) => {
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
    return <span>{idx + 1}</span>;
  } else {
    return (
      <FontAwesomeIcon
        icon={faTrophy}
        style={{ color: content, width: "2rem", marginTop: "0.5rem" }}
      />
    );
  }
};

export default RenderRank;

import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';

interface Props {
  life: number;
}

const Life = ({ life }: Props) => {
  return (
    <>
      {life > 0 &&
        [...Array(life)].map((_, idx) => (
          <span key={idx}>
            <FontAwesomeIcon icon={faHeart} color="#fc8eac" style={{ width: '2rem', height: '2rem' }} />
          </span>
        ))}
    </>
  );
};

export default memo(Life);

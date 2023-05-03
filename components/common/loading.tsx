import loading from '@/styles/common/loading.module.scss';
import Image from 'next/image';

const Loading = () => {
  return (
    <>
      <div className={loading['loading']}>
        <div>
          <div className={loading['icon']}>
            <Image src="/loading_icon.png" width={100} height={100} alt="loading_icon" priority></Image>
          </div>
          <div className={loading['text']}>Loading...</div>
        </div>
      </div>
    </>
  );
};

export default Loading;

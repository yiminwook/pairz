import Head from 'next/head';
import Header from '@/components/common/header/header';

interface Props {
  title?: string;
  children: React.ReactNode;
}

const ServiceLayout = ({ title = 'Pairz!', children }: Props) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      {children}
    </div>
  );
};

export default ServiceLayout;

import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import KonstaLayouts from "@/components/konsta-layouts";
import Head from "next/head";
import { api } from "@/hooks/auth";
import axios from "axios";

interface EkskulProps {
  ekskulId: string | number;
  ekskulName: string;
}

const Ekskul: React.FC<EkskulProps> = ({ ekskulId }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <KonstaLayouts>
      <Head>
        <title>Scan Ekskul</title>
      </Head>
      <h1>{ekskulId}</h1>
    </KonstaLayouts>
  );
};

export default Ekskul;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await axios.get("/api/ekskul/all");
  const paths = data.map((ekskul: any) => ({
    params: { id: ekskul.id.toString(), name: ekskul.name.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<EkskulProps> = async ({
  params,
}) => {
  const id = params?.id as string;
  const name = params?.name as string;

  return {
    props: {
      ekskulId: id,
      ekskulName: name,
    },
    revalidate: 60, // Revalidate this page every 60 seconds
  };
};

import { useRouter } from "next/router";

export const useSaveQuery = () => {
  const router = useRouter();
  const { query } = router;

  const saveQuery = (data: { [key: string]: string | number | null }) => {
    let url: any = {
      pathname: router.pathname,
      query: {
        ...query,
      },
    };

    Object.keys(data).forEach((key) => {
      if (data[key] === null) {
        delete url.query[key];
      } else {
        url.query[key] = data[key];
      }
    });

    router.replace(url, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  return { saveQuery };
};

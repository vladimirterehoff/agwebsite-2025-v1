// Libs
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
// Hooks
import { useCutText } from '@/hooks/useCutText';
// Constants
import { TITLE, DESCRIPTION, GOOGLE_SITE_VERIFICAION } from '@/utils/constants';
import { FRONT_DOMAIN, APP_ENV } from '@/utils/envirenment';
import { NO_INDEX_PAGES } from '@/utils/routers/noindex';

interface Props {
  title?: string;
  description?: string;
  image?: string;
  schemaOrg? : object[]
}

/**
 * Head Meta Component
 * @param props
 * @constructor
 */
const HeadMeta: React.FC<Props> = (props) => {
  const { description = DESCRIPTION, image = '/logo.svg', schemaOrg = [{}] } = props;
  const title = props.title ? `${props.title} | ${TITLE}` : TITLE;
  const { asPath: url, pathname } = useRouter();

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=false" />
      <link rel="canonical" href={`${FRONT_DOMAIN}${url}`} />
      <title>{title}</title>
      <meta name="description" content={useCutText(description, 100)} />

      {APP_ENV !== 'PROD' ? (
        NO_INDEX_PAGES.some((pageUrl : string) => pageUrl === url) ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : null
      ) : (
        <meta name="robots" content="noindex, nofollow" />
      )}

      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

      {/*Schema.org markup for Google+ */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={useCutText(description, 100)} />
      <meta itemProp="image" content={image} />

      {/*Twitter Card data*/}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={useCutText(description, 100)} />
      <meta name="twitter:image:src" content={image} />

      {/*For Facebook*/}
      <meta property="og:site_name" content={TITLE} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:description" content={useCutText(description, 100)} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={'website'} />

      {/*Preload fonts example*/}
      {/*<link rel="preload"
              href="/fonts/jost/Jost-Light.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
       />*/}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: TITLE,
            image: `${FRONT_DOMAIN}/logo.svg`,
            url: FRONT_DOMAIN,
          }),
        }}
      />

      {schemaOrg.map((schema)=>(
          <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
          />
      ))}

      {GOOGLE_SITE_VERIFICAION && (
          <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICAION} />
      )}

    </Head>
  );
};

export default HeadMeta;

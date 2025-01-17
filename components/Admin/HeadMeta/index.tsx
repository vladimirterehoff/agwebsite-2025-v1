// Libs
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
// Hooks
import { useCutText } from '@/hooks/useCutText';
// Constants
import { TITLE, DESCRIPTION } from '@/utils/constants';
import { FRONT_DOMAIN, APP_ENV } from '@/utils/envirenment';

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
    const { asPath: url } = useRouter();

    return (
        <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=false" />
            <link rel="canonical" href={`${FRONT_DOMAIN}${url}`} />
            <title>{title}</title>
            <meta name="description" content={useCutText(description, 100)} />
            <meta name="robots" content="noindex, nofollow" />
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
    );
};

export default HeadMeta;

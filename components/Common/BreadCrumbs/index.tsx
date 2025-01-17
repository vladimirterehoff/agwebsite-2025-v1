// Libs
import React from 'react';
import Link from 'next/link';
// MUI Components
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Skeleton from "@mui/lab/Skeleton";

type Link = {
    url?: string | null;
    text: string;
};

interface Props {
    items?: Link[] | null;
    className?: string;
    currentPageName?: string;
}

const skeletons = new Array(2).fill(<Skeleton variant="text" width={50} height={20} />);

/**
 * Breadcrumbs component
 * @param props
 * @constructor
 */
const BreadCrumbs = (props: Props) => {
    const { items } = props;

    return (
        <Breadcrumbs separator="/" aria-label="breadcrumb" className={props.className}>
            {items
                ? items.map(({ url, text }) => {
                    return url ? (
                        <Link href={`${url}`} key={url + '-breadcrumb-list'} legacyBehavior>
                            <a className="breadcrumb__link">{text}</a>
                        </Link>
                    ) : (
                        <span className="breadcrumb__link">{text}</span>
                    );
                })
                : skeletons.map((skeleton, index) => <div key={index + 'skeleton'}>{skeleton}</div>)}
        </Breadcrumbs>
    );
};

export default BreadCrumbs;

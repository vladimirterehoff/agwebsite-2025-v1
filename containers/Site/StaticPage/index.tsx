// Libs
import React from 'react';
import {useSelector} from "react-redux";
// Redux
import {AppState} from "@/app-redux/state";

interface Props {
    title: string
}

/**
 * Static Page Container
 * @param props
 * @constructor
 */
const StaticPage = (props: Props) => {
    const { data } = useSelector((state: AppState) => state.staticPages);

    return (
        <>
            <h1>
                {props.title}
            </h1>
            {data && (
                <div className="text-content" dangerouslySetInnerHTML={{__html:data.description.en}} />
            )}
        </>
    );
};

export default StaticPage;

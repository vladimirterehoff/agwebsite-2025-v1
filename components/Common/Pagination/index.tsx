// Libs
import React, { ChangeEvent } from 'react';
// MUI Components
import MaterialPagination from "@mui/lab/Pagination";
import Skeleton from "@mui/lab/Skeleton";

interface Props {
    count?: number;
    currentPage?: number;
    hideNextButton?: boolean;
    hidePrevButton?: boolean;
    onChange: (page: number) => void;
    showFirstButton?: boolean;
    showLastButton?: boolean;
}

/**
 * Pagination Component
 * @param props
 * @constructor
 */
const Pagination = (props: Props) => {
    const handleChange = (_: ChangeEvent<unknown>, page: number) => {
        props.onChange(page);
    };

    return props.currentPage ? (
        <MaterialPagination
            className="pagination"
            count={props.count}
            onChange={handleChange}
            page={props.currentPage}
            showFirstButton={props.showFirstButton}
            showLastButton={props.showLastButton}
            hideNextButton={props.hideNextButton}
            hidePrevButton={props.hidePrevButton}
        />
    ) : (
        <Skeleton variant="rectangular" width="250px" height="20px" />
    );
};

export default Pagination;

// Libs
import React, {ReactNode} from 'react';
import  Link  from 'next/link';
// MUI Components
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

interface Props {
  editLink?: string;
  deleteCallback?: () => void;
  disallowDelete?: boolean;
  children?: ReactNode
}

/**
 * CRUD List Actions Component
 * @param props
 * @constructor
 */
const Index = (props: Props) => {

  return (
    <>
      {props.children}

      {props.editLink && (
        <Link href={props.editLink}>
          <Tooltip title="Edit">
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
      )}

      {props.deleteCallback && !props.disallowDelete && (
        <Tooltip title="Delete">
          <IconButton  onClick={props.deleteCallback} >
            <DeleteForeverOutlinedIcon color={'secondary'}/>
          </IconButton>
        </Tooltip>
      )}


    </>
  );
};

export default Index;

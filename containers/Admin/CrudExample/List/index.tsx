// Libs
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// Redux
import { AppState } from '@/app-redux/state';
import { crudExampleActions } from '@/app-redux/crudExample/actions';
// MUI Components
import { Box, Table, Card, TableBody, TableCell, TableHead, TableRow,} from '@mui/material';
// Components
import Loader from '@/components/Common/Loader';
import ContentHeader from '@/components/Admin/ContentHeader';
import CRUDListActions from '@/components/Admin/Crud/ListActions';
// Hooks
import { useCrudList } from '@/hooks/crud/useCrudList';
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from '@/utils/routers/admin';

/**
 * Crud Example List Container
 * @constructor
 */
const List = () => {
  const { loading, list, pagination } = useSelector((state: AppState) => state.crudExample);
  const { getList, deleteModal, handleDelete, paginationEl, sortBlock, searchEl, filter} = useCrudList(
    crudExampleActions,
    pagination,
  );
  useEffect(() => {
    filter.searchItems(['name']);
    getList();
  }, []);

  return (
    <>
      <ContentHeader title='Crud Example'
                     needAddLink={true}
                     modelName="Crud Example"
                     urlSlug={ADMIN_PATH.CRUD}
                     breadcrumbs={[
                       { url: ADMIN_MAIN, text: 'Dashboard' },
                       {url: false, text: 'Crud Example'}]}/>

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />

          {searchEl('Search by name')}

          {list && (
            <>
              <Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Name {sortBlock('name')}</TableCell>
                      <TableCell align="right"> Actions </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => {
                      return (
                        <TableRow hover key={item.id}>
                          <TableCell> {item.name} </TableCell>

                          <TableCell align="right">
                            <CRUDListActions
                              editLink={`${ADMIN_PATH.CRUD}/${item.id}`}
                              deleteCallback={()=>handleDelete(item)}/>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>

              {list.length==0 && !loading && (
                <p className="emptyList">List is empty</p>
              )}

              {paginationEl}
            </>
          )}

          {deleteModal}
        </div>
      </Card>
    </>
  );
};

export default List;

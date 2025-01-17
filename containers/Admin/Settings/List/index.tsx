import React, { useEffect } from 'react';
import { useCrudList } from 'hooks/crud/useCrudList';
import { useSelector } from 'react-redux';
import { AppState } from '@/app-redux/state';
import { Box, Card } from '@mui/material';
import Loader from '@/components/Common/Loader';
import ContentHeader from '@/components/Admin/ContentHeader';
import CRUDListActions from '@/components/Admin/Crud/ListActions';
import { ADMIN_PATH } from '@/utils/routers/admin';
import { settingsActions, Setting } from 'app-redux/settings';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const List = () => {
  const { loading, list, pagination } = useSelector((state: AppState) => state.settings);
  const { getList, paginationEl} = useCrudList(
      settingsActions,
    pagination,
  );

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <ContentHeader title='Settings'
                     needAddLink={false}
                     modelName="Contact"
                     urlSlug={ADMIN_PATH.SETTINGS}
                     breadcrumbs={[
                       { url: '/admin', text: 'Dashboard' },
                       {url: false, text: 'Settings'}]}/>

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />

          {list && (
            <>
              <Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell> Description</TableCell>
                        <TableCell> Value</TableCell>
                        <TableCell align="right"> Actions </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((item) => {
                        return (
                          <TableRow hover key={item.id}>
                            <TableCell> {item.description} </TableCell>
                            <TableCell> {item.value}{item.key === 'sporthub_commission' ? ' (%)' : ''} </TableCell>
                            <TableCell align="right">
                              <CRUDListActions editLink={`${ADMIN_PATH.SETTINGS}/${item.id}`}/>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              {list.length==0 && (
                <p className="emptyList">List is empty</p>
              )}

              {paginationEl}
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default List;

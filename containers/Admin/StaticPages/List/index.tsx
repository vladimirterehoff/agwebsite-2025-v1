// Libs
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// Redux
import { AppState } from '@/app-redux/state';
import { staticPagesActions } from '@/app-redux/staticPages/actions';
import { StaticPage } from '@/app-redux/staticPages/model';
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
 * Static Pages List Container
 * @constructor
 */
const StaticPagesList = () => {
  const { loading, list, pagination } = useSelector((state: AppState) => state.staticPages);
  const { getList, paginationEl} = useCrudList(
    staticPagesActions,
    pagination,
  );

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <ContentHeader title='Static Pages'
                     needAddLink={false}
                     modelName="StaticPage"
                     urlSlug={ADMIN_PATH.STATIC_PAGES}
                     breadcrumbs={[
                       { url: ADMIN_MAIN, text: 'Dashboard' },
                       {url: false, text: 'Static Pages'}]}/>

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />
          {list && (
            <>
              <Box className="admin-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> Slug </TableCell>
                      <TableCell align="right"> Actions </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(list as Array<StaticPage>).map((item: any) => {
                      return (
                        <TableRow hover key={item.id}>

                          <TableCell> {item.slug} </TableCell>

                          <TableCell align="right">

                            <CRUDListActions editLink={`${ADMIN_PATH.STATIC_PAGES}/${item.id}`} />

                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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

export default StaticPagesList;

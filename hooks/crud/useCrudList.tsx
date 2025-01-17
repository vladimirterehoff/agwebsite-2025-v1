// Libs
import React, { ChangeEvent, ReactNode, useCallback, useEffect, useState } from 'react';
// MUI Components
import TablePagination from "@mui/material/TablePagination";
import InputAdornment from "@mui/material/InputAdornment";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import SvgIcon from "@mui/material/SvgIcon";
import IconButton from "@mui/material/IconButton";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// Icons
import SearchIcon from "@mui/icons-material/Search";
import CloseOutlined from '@mui/icons-material/CloseOutlined';
// Hooks
import { useConfirm } from '@/hooks/dialog/useConfirm';
// Helpers
import { FilterService } from '@/helpers/filterService/index';
import { notify } from '@/helpers/notify';

interface BaseType {
  id:number
}

const MIN_SEARCH_LENGTH = 2;

/**
 * CRUD List helper
 * @param actions - actions of the crud from app-redux
 * @param pagination - pagination object from the store
 */
export const useCrudList = function useCrudListFN<T extends BaseType>(actions: any, pagination: any) {
  const [filter] = useState(new FilterService());
  const [sort, setSort] = useState<{ name: string, locale: string, direction: string }>({ name: '', locale: '', direction: '' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Get List
   */
  const getList = useCallback( (page = 1): void => {
    setLoading(true);
    filter.page(page);

    if (sort.name != '') {
      if (sort.locale != '') {
        filter.sort('')
        const direction = sort.direction == '-' ? 'desc' : 'asc';
        filter.scope({ 
          name: "sortByTranslateField",
          parameters: [sort.locale, sort.name, direction]})
      }
      else {
        filter.clearScope()
        filter.sort(`${sort.direction}${sort.name}`);
      }
    }

    getListRequest();
  }, [sort,search,searchQuery]);

  const  getListRequest = async ()=>{
    await actions.get(null, filter.filter);
    setLoading(false);
  }

  /**
   * DELETE
   */
  const [tmpItem, setTmpItem] = useState(null);
  const handleDelete = useCallback((item: any): void => {
    if (item) {
      setTmpItem(item);
      openDeleteModal();
    }
  }, []);
  const handleDeleteAction = async () => {
    if (tmpItem) {
      try{
        await actions.delete((tmpItem as any).id);
        getList();
      }
      catch (e: any) {
        const errMsq : any = []
        e.errors && e.errors.forEach((error: any) => {
          error.errors.forEach((message: string) => {
            errMsq.push(message)
          });
        });
        if(errMsq.length) notify.error(errMsq.join(' '));
      }
    }
  };
  const [deleteModal, openDeleteModal] = useConfirm(
    'DELETE',
    'Are you sure?',
    handleDeleteAction,
  );

  /**
   * SORT
   * @param field
   */
  const sortBlock = (field: string, locale?: string) => {
    return (
      <>
      <br/>
      <div style={{display: 'inline', position: 'absolute', bottom: 4, left: 0, right: 0 }}>
        <IconButton size="small" color="default" onClick={() => setSortAction(field, locale)}>
          {sort.name == field && sort.direction != '-' ? (
            <KeyboardArrowUpIcon color="primary" style={{ fontSize: 18 }} />
          ) : sort.name == field && sort.direction == '-' ? (
            <KeyboardArrowDownIcon color="primary" style={{ fontSize: 18 }} />
          ) : (
            <UnfoldMoreIcon style={{ fontSize: 18 }} />
          )}
        </IconButton>
      </div>
      </>
    );
  };
  useEffect(() => {
    if (sort.name != '') getList();
  }, [sort]);
  const setSortAction = (field: string, locale?: string): void => {
    let direction = '';
    if (sort.name && sort.name == field && sort.direction != '-') direction = `-`;

    setSort({ name: field, locale: locale ? locale : '', direction });
    
  };

  /**
   * SEARCH
   * @param event
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setSearch(event.target.value);
  };

  const searchAction = (): void => {
    if(!loading && searchQuery!=search)  {
      if(search.length >= MIN_SEARCH_LENGTH ) {
        filter.search(search);
        setSearchQuery(search);
        getList();
      }
      else if(searchQuery!=''){
        filter.search('');
        setSearchQuery('');
        getList();
      }
    }
  };

  React.useEffect(() => {
    if(!loading) searchAction();
  }, [search, loading]);

  const searchElement = (placeholder? :string, params?: { props?: TextFieldProps }) =>{
    const { props } = params || {};
    const { InputProps, ...otherProps } = props || {};
    return (
        <TextField
            fullWidth={true}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {search.length < MIN_SEARCH_LENGTH ? (
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  ) : (
                    <SvgIcon
                      fontSize="small"
                      color="action"
                      onClick={() => setSearch('')}
                      style={{ cursor: 'pointer' }}
                    >
                      <CloseOutlined />
                    </SvgIcon>
                  )}
                </InputAdornment>
              ),
              ...InputProps,
            }}
            onChange={handleSearchChange}
            label={placeholder ? placeholder : 'Search'}
            value={search}
            variant="filled"
            {...otherProps}
        />
    )
  };

  /**
   * PAGINATION
   */
  /**
   * Change Page
   */
  const handlePageChange = useCallback((event: any, newPage: number): void => {
    getList(newPage + 1);
  }, []);

  /**
   * Change Limit
   * @param event
   */
  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>) => {
    const limit = parseInt(event.target.value);
    filter.limit(limit);
    getList(1);
  };
  const paginationEl = (
    <>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={pagination.current_page - 1}
          rowsPerPage={pagination.per_page}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      )}
    </>
  );

  return {
    filter : filter,
    getList : getList,
    deleteModal : deleteModal,
    handleDelete : handleDelete,
    paginationEl : paginationEl,
    sortBlock : sortBlock,
    searchEl : searchElement,
  };
};

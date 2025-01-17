// Libs
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import moment from "moment";
// Redux
import { AppState } from "@/app-redux/state";
import { providersActions } from "@/app-redux/providers/actions";
import { PROVIDER_RELATIONS } from "@/app-redux/providers/relations";
// MUI Components
import {
  Box,
  Table,
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDListActions from "@/components/Admin/Crud/ListActions";
import SwitchIsActive from "@/components/Admin/Crud/SwitchIsActive";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
// Styles
import styles from "./style.module.scss";

const filterList = [
  { id: 'true', name: 'Active' },
  { id: 'false', name: 'Inactive' },
];

/**
 * Workshops List Container
 * @constructor
 */
const WorkshopsList = () => {
  // Store
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.providers
  );

  // State
  const [listFilter, setListFilter] = useState<string>("not_selected");

  const firstGetData = async () => {
    filter.expand([
      PROVIDER_RELATIONS.AVATAR,
      PROVIDER_RELATIONS.WALLET,
      PROVIDER_RELATIONS.SERVICES,
    ]);
    filter.searchItems(["translations.name"]);
    filter.builder.equal("type", "stationary");
    // getList();
  };

  useEffect(() => {
    firstGetData();
  }, []);

  // Hooks
  const {
    getList,
    paginationEl,
    deleteModal,
    handleDelete,
    filter,
    searchEl,
    sortBlock,
  } = useCrudList(providersActions, pagination);

  const changeFilter = () => {
    if (listFilter === "not_selected") {
      filter.builder.remove("is_active");
    } else {
      filter.builder.in("is_active", [listFilter === 'true' ? true : listFilter === 'false' ? false : listFilter]);
    }

    getList();
  };

  useEffect(() => {
    changeFilter();
  }, [listFilter]);

  return (
    <>
      <ContentHeader
        title="Workshops"
        needAddLink={true}
        modelName="Workshops"
        urlSlug={ADMIN_PATH.WORKSHOPS}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Workshops" },
        ]}
      />

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />

          <Grid container spacing={0}>
            <Grid item xs={12} sm={9}>
              {searchEl("Search", {
                props: {
                  InputProps: {
                    sx: {
                      borderTopRightRadius: { sm: 0 },
                      borderRight: { sm: "1px solid #838486" },
                    },
                  },
                },
              })}
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl variant="filled" style={{ width: "100%" }}>
                <InputLabel id="filter-select-label">Filter by status</InputLabel>
                <Select
                  value={listFilter}
                  name={"active"}
                  label="Filter by status"
                  defaultValue={"not_selected"}
                  fullWidth
                  variant="filled"
                  onChange={(event) => {
                    setListFilter(event.target.value);
                  }}
                  labelId="filter-select-label"
                  sx={{
                    borderTopLeftRadius: { sm: 0 },
                  }}
                >
                  <MenuItem value={`not_selected`}>All</MenuItem>
                  {filterList.map((item) => (
                    <MenuItem key={item.name} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {list && (
            <>
              <Box className="admin-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID {sortBlock("id")}</TableCell>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Name {sortBlock("name", "en")}</TableCell>
                      <TableCell>Status {sortBlock("status")}</TableCell>
                      <TableCell> Balance {sortBlock("wallet.balance")}</TableCell>
                      <TableCell>
                        Creation date {sortBlock("created_at")}
                      </TableCell>
                      <TableCell>Is active {sortBlock("is_active")}</TableCell>
                      <TableCell align="right"> Actions </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => {
                      return (
                        <TableRow hover key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell className={styles.avatarCell}>
                            {item.relations?.avatar ? (
                              <Image
                                src={item.relations?.avatar?.url}
                                width={64}
                                height={64}
                                alt="avatar"
                                quality={70}
                                className={styles.avatar}
                              />
                            ) : null}
                          </TableCell>
                          <TableCell>{item.name.en}</TableCell>
                          <TableCell>
                            {item.status?.replace(/_/g, " ")
                              .replace(/^\w/, (c) => c.toUpperCase())}
                          </TableCell>
                          <TableCell>
                            {item.relations?.wallet?.balance}
                          </TableCell>
                          <TableCell>{moment(item.created_at).format('YYYY-MM-DD')}</TableCell>
                          <TableCell>
                            <SwitchIsActive
                              data={item}
                              action={providersActions}
                              callBackOnSuccess={getList}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <CRUDListActions
                              editLink={`${ADMIN_PATH.WORKSHOPS}/${item.id}`}
                              deleteCallback={() => handleDelete(item)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              {list.length == 0 && <p className="emptyList">List is empty</p>}

              {paginationEl}
            </>
          )}
        </div>
        {deleteModal}
      </Card>
    </>
  );
};

export default WorkshopsList;

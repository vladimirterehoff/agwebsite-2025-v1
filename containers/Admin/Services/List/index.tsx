// Libs
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
// Redux
import { AppState } from "@/app-redux/state";
import { SERVICE_RELATIONS } from "@/app-redux/services/relations";
import { servicesActions } from "@/app-redux/services/actions";
import { SERVICE_AVAILABILITY } from "@/app-redux/services/model";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDListActions from "@/components/Admin/Crud/ListActions";
import SwitchIsActive from "@/components/Admin/Crud/SwitchIsActive";
// Helpers
import { enumToSelectList } from "@/helpers/enumToSelectList";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
import { useSaveQuery } from "@/hooks/useSaveQuery";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
// Styles
import styles from "./style.module.scss";

const filterList = [
  { name: '-- Select --', id: 'not_selected' },
  { id: 'true', name: 'Active' },
  { id: 'false', name: 'Inactive' },
];

export const availabilityList = enumToSelectList(SERVICE_AVAILABILITY);

/**
 * Services List Container
 */
const ServicesList = () => {
  // Store
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.services
  );

  // Hooks
  const {
    getList,
    paginationEl,
    deleteModal,
    handleDelete,
    filter,
    searchEl,
    sortBlock,
  } = useCrudList(servicesActions, pagination);
  const { query } = useRouter();
  const { saveQuery } = useSaveQuery();

  const [availabilityFilter, setAvailabilityFilter] = useState<string | number>(
    query?.availability ? `${query?.availability}` : "not_selected"
  );
  const [listFilter, setListFilter] = useState<string>("not_selected");

  const changeAvailabilityFilter = () => {
    if (availabilityFilter === "not_selected") {
      filter.builder.remove("availability");
    } else {
      filter.builder.in("availability", [availabilityFilter]);
    }

    saveQuery({
      availability:
        availabilityFilter === "not_selected" ? null : availabilityFilter,
    });
    getList();
  };

  const changeFilter = () => {
    if (listFilter === "not_selected") {
      filter.builder.remove("is_active");
    } else {
      filter.builder.in("is_active", [listFilter === 'true' ? true : listFilter === 'false' ? false : listFilter]);
    }

    getList();
  };

  const firstGetData = async () => {
    filter.searchItems(["translations.name"]);
    getList();
  };

  useEffect(() => {
    firstGetData();
  }, []);

  useEffect(changeAvailabilityFilter, [availabilityFilter]);
  useEffect(changeFilter, [listFilter]);

  return (
    <>
      <ContentHeader
        title="Services"
        needAddLink={true}
        modelName="Services"
        urlSlug={ADMIN_PATH.SERVICES}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Services" },
        ]}
      />

      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
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
            <InputLabel id="availability-filter-select-label">
              Availability filter
            </InputLabel>
            <Select
              value={availabilityFilter}
              label={"Availability filter"}
              name={"availability"}
              defaultValue={"not_selected"}
              fullWidth
              variant="filled"
              labelId="availability-filter-select-label"
              onChange={(event) => {
                setAvailabilityFilter(event.target.value);
              }}
              sx={{
                borderRadius: { sm: 0 },
                borderRight: { sm: "1px solid #838486" },
              }}
            >
              <MenuItem value={`not_selected`}>-- Select --</MenuItem>
              {availabilityList.map((item) => (
                <MenuItem key={item.name} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl variant="filled" style={{ width: "100%" }}>
            <InputLabel id="status-filter-select-label">Filter by status</InputLabel>
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
              labelId="status-filter-select-label"
              sx={{
                borderTopLeftRadius: { sm: 0 },
              }}
            >
              {filterList.map((item) => (
                <MenuItem key={item.name} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />

          {list && (
            <>
              <Box className="admin-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID {sortBlock("id")}</TableCell>
                      <TableCell>Name {sortBlock("name", "en")}</TableCell>
                      <TableCell>
                        Availability {sortBlock("availability")}
                      </TableCell>
                      <TableCell>Is active</TableCell>
                      <TableCell align="right"> Actions </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => {
                      return (
                        <TableRow hover key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name.en}</TableCell>
                          <TableCell>
                            {item.availability.replace(/^\w/, (c) =>
                              c.toUpperCase()
                            )}
                          </TableCell>

                          <TableCell>
                            <SwitchIsActive data={item} action={servicesActions} save="value" callBackOnSuccess={() => getList()} />
                          </TableCell>

                          <TableCell align="right">
                            <CRUDListActions
                              editLink={`${ADMIN_PATH.SERVICES}/${item.id}`}
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

export default ServicesList;

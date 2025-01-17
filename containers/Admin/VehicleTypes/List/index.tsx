// Libs
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
// Redux
import { AppState } from "@/app-redux/state";
import { vehicleTypesActions } from "@/app-redux/vehicleTypes/actions";
// MUI Components
import {
  Box,
  Table,
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDListActions from "@/components/Admin/Crud/ListActions";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import SwitchIsActive from "@/components/Admin/Crud/SwitchIsActive";

const filterList = [
  { id: 'true', name: 'Active' },
  { id: 'false', name: 'Inactive' },
];

/**
 * Vehicle Types List Container
 * @constructor
 */
const VehicleTypesList = () => {
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.vehicleTypes
  );
  const { getList, paginationEl, deleteModal, handleDelete, filter, searchEl, sortBlock } = useCrudList(
    vehicleTypesActions,
    pagination
  );

  const [listFilter, setListFilter] = useState<string>("not_selected");

  const changeFilter = () => {
    if (listFilter === "not_selected") {
      filter.builder.remove("is_active");
    } else {
      filter.builder.in("is_active", [listFilter === 'true' ? true : listFilter === 'false' ? false : listFilter]);
    }

    getList();
  };

  useEffect(() => {
    filter.searchItems(["translations.name"]);
    getList();
  }, []);

  useEffect(() => {
    changeFilter();
  }, [listFilter]);

  return (
    <>
      <ContentHeader
        title="Vehicle types"
        needAddLink={true}
        modelName="VehicleTypes"
        urlSlug={ADMIN_PATH.VEHICLE_TYPES}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Vehicle types" },
        ]}
      />

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

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />
          {list && (
            <>
              <Box className="admin-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell> ID {sortBlock("id")}</TableCell>
                      <TableCell> Name {sortBlock("name", "en")}</TableCell>
                      <TableCell> Is active {sortBlock("is_active")}</TableCell>
                      <TableCell align="right"> Actions </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => {
                      return (
                        <TableRow hover key={item.id}>
                          <TableCell> {item.id} </TableCell>
                          <TableCell width={"50%"}> {item.name.en} </TableCell>
                          <TableCell>
                            <SwitchIsActive
                              data={item}
                              action={vehicleTypesActions}
                              callBackOnSuccess={getList}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <CRUDListActions
                              editLink={`${ADMIN_PATH.VEHICLE_TYPES}/${item.id}`}
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

export default VehicleTypesList;

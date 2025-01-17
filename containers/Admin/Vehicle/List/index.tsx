// Libs
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { vehiclesActions } from "@/app-redux/vehicles/actions";
import { VEHICLE_RELATIONS } from "@/app-redux/vehicles/relations";
// MUI Components
import {
  Box,
  Table,
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDListActions from "@/components/Admin/Crud/ListActions";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";

/**
 * Vehicle List Container
 * @constructor
 */
const VehicleList = () => {
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.vehicles
  );
  const {
    getList,
    paginationEl,
    deleteModal,
    handleDelete,
    filter,
    searchEl,
    sortBlock,
  } = useCrudList(vehiclesActions, pagination);

  useEffect(() => {
    filter.expand([
      VEHICLE_RELATIONS.VEHICLE_TYPE,
      VEHICLE_RELATIONS.MANUFACTURER,
      VEHICLE_RELATIONS.USER,
    ]);
    filter.searchItems([
      "model",
      "body_type",
      "color",
      "license_plate",
      "user.first_name",
      "user.last_name",
      "manufacturer.name",
    ]);
    getList();
  }, []);

  return (
    <>
      <ContentHeader
        title="Vehicles"
        needAddLink={false}
        modelName="Vehicles"
        urlSlug={ADMIN_PATH.VEHICLES}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Vehicles" },
        ]}
      />

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />

          {searchEl("Search")}

          {list && (
            <>
              <Box className="admin-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID {sortBlock("id")} </TableCell>
                      <TableCell>Model {sortBlock("model")} </TableCell>
                      <TableCell>
                        License plate {sortBlock("license_plate")}
                      </TableCell>
                      <TableCell>Color {sortBlock("color")}</TableCell>
                      <TableCell>Brand {sortBlock("manufacturer.name")}</TableCell>
                      <TableCell>Vehicle type</TableCell>
                      <TableCell>
                        User first name {sortBlock("user.first_name")}
                      </TableCell>
                      <TableCell>
                        User last name {sortBlock("user.last_name")}
                      </TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => {
                      return (
                        <TableRow hover key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.model}</TableCell>
                          <TableCell>{item.license_plate}</TableCell>
                          <TableCell>{item.color}</TableCell>
                          <TableCell>
                            {item.relations.manufacturer?.name}
                          </TableCell>
                          <TableCell>{item.relations.vehicleType?.name.en}</TableCell>
                          <TableCell>
                            {item.relations.user?.first_name}
                          </TableCell>
                          <TableCell>
                            {item.relations.user?.last_name}
                          </TableCell>

                          <TableCell align="right">
                            <CRUDListActions
                              editLink={`${ADMIN_PATH.VEHICLES}/${item.id}`}
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

export default VehicleList;

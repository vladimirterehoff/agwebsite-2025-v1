// Libs
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { CITY_ZONES_RELATIONS } from "@/app-redux/cityZones/relations";
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
} from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDListActions from "@/components/Admin/Crud/ListActions";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import {cityZonesActions} from "@/app-redux/cityZones/actions";

/**
 * City zones List Container
 */
const CityZonesList = () => {
  // Store
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.cityZones
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
  } = useCrudList(cityZonesActions, pagination);
  useEffect(() => {
    filter.expand([CITY_ZONES_RELATIONS.CITY]);
    filter.searchItems(["translations.name", "city.translations.name"]);
    getList();

    return () => {
      cityZonesActions.clearData();
    };
  }, []);

  return (
    <>
      <ContentHeader
        title="City zones"
        needAddLink={true}
        modelName="city-zones"
        urlSlug={ADMIN_PATH.CITY_ZONES}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "City zones" },
        ]}
      />

      <Grid container spacing={0}>
        <Grid item xs={12} sm={12}>
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
                      <TableCell>
                        <Box display={"flex"} alignItems={"center"}>
                          ID {sortBlock("id")}
                        </Box>
                      </TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>City</TableCell>
                      <TableCell align="right"> Actions </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => {
                      return (
                        <TableRow hover key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name.en}</TableCell>
                          <TableCell>{item.relations?.city?.name.en}</TableCell>
                          <TableCell align="right">
                            <CRUDListActions
                              editLink={`${ADMIN_PATH.CITY_ZONES}/${item.id}`}
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

export default CityZonesList;

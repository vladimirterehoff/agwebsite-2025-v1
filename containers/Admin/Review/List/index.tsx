// Libs
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import moment from "moment";
// Redux
import { AppState } from "@/app-redux/state";
import { reviewsActions } from "@/app-redux/reviews/actions";
import { REVIEW_RELATIONS } from "@/app-redux/reviews/relations";
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
  MenuItem,
  Select,
} from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import SwitchIsActive from "@/components/Admin/Crud/SwitchIsActive";
import ProviderLink from "@/components/Admin/ProviderLink";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
// Helpers
import useCheckRole from "@/hooks/useIsAdmin";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
// Styles
import styles from "./style.module.scss";

const filterList = [
  { id: "true", name: "Active" },
  { id: "false", name: "Inactive" },
];

/**
 * Review List Container
 */
const ReviewList = () => {
  // Store
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.reviews
  );

  const firstGetData = async () => {
    filter.expand([
      REVIEW_RELATIONS.USER,
      REVIEW_RELATIONS.USER_AVATAR,
      REVIEW_RELATIONS.PROVIDER,
    ]);
    filter.sort("-created_at");
    filter.searchItems([
      "id",
      "description",
      "user.first_name",
      "user.last_name",
      "user.full_name",
      "user.email",
      "order_id",
    ]);
    // getList();
  };

  useEffect(() => {
    firstGetData();
  }, []);

  // Hooks
  const { getList, paginationEl, deleteModal, filter, searchEl, sortBlock } =
    useCrudList(reviewsActions, pagination);
  const { isWorkshopManager } = useCheckRole(); 

  const [listFilter, setListFilter] = useState<string>("not_selected");

  const changeFilter = () => {
    if (listFilter === "not_selected") {
      filter.builder.remove("is_active");
    } else {
      filter.builder.in("is_active", [
        listFilter === "true"
          ? true
          : listFilter === "false"
          ? false
          : listFilter,
      ]);
    }

    getList();
  };

  useEffect(changeFilter, [listFilter]);

  return (
    <>
      <ContentHeader
        title="Reviews"
        needAddLink={false}
        modelName="Review"
        urlSlug={ADMIN_PATH.REVIEWS}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Reviews" },
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

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />

          {list && (
            <>
              <Box className="admin-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width={80}>ID {sortBlock("id")}</TableCell>
                      <TableCell width={80}>
                        Rating {sortBlock("rating")}
                      </TableCell>
                      <TableCell width={150}>
                        Date {sortBlock("date")}
                      </TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Workshop/Cleaner</TableCell>
                      <TableCell width={100}>
                        Order ID{sortBlock("order_id")}
                      </TableCell>
                      <TableCell width={100}>Is active</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => {
                      return (
                        <React.Fragment key={item.id}>
                          <TableRow hover>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>
                              {Number(item.rating).toFixed(1)}
                            </TableCell>
                            <TableCell>
                              {moment(item.created_at).format(
                                "YYYY.MM.DD HH:mm"
                              )}
                            </TableCell>
                            <TableCell>
                              {item?.relations?.user === null ? 'Deleted user' : 
                                isWorkshopManager ? item?.relations?.user?.full_name : <Link
                                  href={`${ADMIN_PATH.USERS}/${item?.user_id}/view`}
                                >
                                  {item?.relations?.user?.full_name}
                                </Link>
                              }
                            </TableCell>
                            <TableCell>
                              <ProviderLink
                                provider={item?.relations?.provider}
                              />
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`${ADMIN_PATH.ORDERS}/${item.order_id}/view`}
                              >
                                {item.order_id}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <SwitchIsActive
                                data={item}
                                action={reviewsActions}
                                save="value"
                                callBackOnSuccess={() => getList()}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow hover>
                            <TableCell
                              colSpan={8}
                              sx={{
                                maxWidth: { xs: "100vw" },
                              }}
                            >
                              <b>Description:</b>
                              <br />
                              <span className={styles.description}>
                                {item.description || "-"}
                              </span>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
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

export default ReviewList;

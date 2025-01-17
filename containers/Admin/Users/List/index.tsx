// Libs
import React, {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";
import Image from "next/image";
import Link from "next/link";
// Redux
import {AppState} from "@/app-redux/state";
import {usersActions} from "@/app-redux/users/actions";
import {ROLE_SLUGS} from "@/app-redux/roles/model";
import {rolesActions} from "@/app-redux/roles/actions";
import {USER_RELATIONS} from "@/app-redux/users/relations";
// MUI Components
import {
  Box,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDListActions from "@/components/Admin/Crud/ListActions";
import SwitchDeactivate from "@/components/Admin/Crud/SwitchDeactivate";
// Hooks
import {useCrudList} from "@/hooks/crud/useCrudList";
import {useSaveQuery} from "@/hooks/useSaveQuery";
// Constants
import {ADMIN_MAIN, ADMIN_PATH} from "@/utils/routers/admin";
// Styles
import styles from "./style.module.scss";
// Helpers
import checkActiveUser from "./helpers/checkActiveUser";
import Chip from "@mui/material/Chip";
import {User} from "@/app-redux/users/model";
import {PROVIDER_STATUS} from "@/app-redux/providers/model";
import moment from "moment/moment";

const NotFilteredRoles = [ROLE_SLUGS.BACKEND_SIGN_IN, ROLE_SLUGS.SIGN_IN];

/**
 * Users List Container
 * @constructor
 */
const UsersList = () => {
  // Store
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.users
  );
  const { list: roles } = useSelector((state: AppState) => state.roles);

  // Hooks
  const { query } = useRouter();
  const { saveQuery } = useSaveQuery();
  const {
    getList,
    paginationEl,
    deleteModal,
    handleDelete,
    filter,
    searchEl,
    sortBlock,
  } = useCrudList(usersActions, pagination);

  // State
  const [roleFilter, setRoleFilter] = useState<string | number>(
    query?.role ? `${query?.role}` : "all"
  );

  const roleFilterList = useMemo(() => {
    return roles.filter((role) => !NotFilteredRoles.includes(role.slug));
  }, [roles]);

  const changeRoleFilter = () => {
    if (roleFilter === "all") {
      filter.builder.remove("roles.slug");
    } else {
      filter.builder.in("roles.slug", [roleFilter]);
    }

    filter.expand([
      USER_RELATIONS.AVATAR,
      USER_RELATIONS.PROVIDER_ACTIVE_ORDER,
      USER_RELATIONS.ROLES,
      USER_RELATIONS.PERMISSIONS,
    ]);
    filter.searchItems([
      "first_name",
      "last_name",
      "full_name",
      "email",
      "phone",
      "personal_email",
    ]);

    // changeRoleFilter();

    saveQuery({ role: roleFilter === "all" ? null : roleFilter });
    getList();
  };

  const firstGetData = async () => {
    if (!roles?.length) await rolesActions.get(undefined, "limit=100");

    // filter.expand([USER_RELATIONS.AVATAR]);
    // filter.searchItems([
    //   "first_name",
    //   "last_name",
    //   "email",
    //   "phone",
    //   "personal_email",
    // ]);

    // changeRoleFilter();
    // getList();
  };

  const getStatusChip = (user: User) => {
    const provider = user.relations?.provider;

    if (provider?.relations?.activeOrder?.id) {
      return (
        <Chip
          label={
            <Link href={`${ADMIN_PATH.ORDERS}/${provider?.relations?.activeOrder?.id}/view`} target="_blank">
              On Order
            </Link>
          }
          color="warning"
        />
      );
    } else if (provider?.status === PROVIDER_STATUS.AVAILABLE) {
      return <Chip label="Free" color="success" />;
    } else if (provider?.status === PROVIDER_STATUS.NOT_AVAILABLE || provider?.status === null) {
      return <Chip label="Offline" color="default" />;
    } else {
      return null;
    }
  };

  useEffect(() => {
    firstGetData();
  }, []);
  useEffect(changeRoleFilter, [roleFilter]);

  return (
    <>
      <ContentHeader
        title="Users"
        needAddLink={true}
        modelName="Users"
        urlSlug={ADMIN_PATH.USERS}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Users" },
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
            <InputLabel id="filter-select-label">Filter by role</InputLabel>
            <Select
              value={roleFilter}
              name={"active"}
              label="Filter by role"
              defaultValue={"all"}
              fullWidth
              variant="filled"
              onChange={(event) => {
                setRoleFilter(event.target.value);
              }}
              labelId="filter-select-label"
              sx={{
                borderTopLeftRadius: { sm: 0 },
              }}
            >
              <MenuItem value={`all`}>All</MenuItem>
              {roleFilterList.map((item) => (
                <MenuItem key={item.name} value={item.slug}>
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
                      <TableCell>Avatar</TableCell>
                      <TableCell>
                        First name {sortBlock("first_name")}
                      </TableCell>
                      <TableCell>Last name {sortBlock("last_name")}</TableCell>
                      <TableCell>Email {sortBlock("email")}</TableCell>
                      <TableCell>Phone {sortBlock("phone")}</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Cleaner status</TableCell>
                      <TableCell>Is Active</TableCell>
                      <TableCell>Created at</TableCell>
                      <TableCell align="right">Actions</TableCell>
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
                          <TableCell>{item.first_name}</TableCell>
                          <TableCell>{item.last_name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.phone}</TableCell>
                          <TableCell>
                            {item.relations?.roles?.map((role, index) => (
                              <React.Fragment key={index}>
                                {role.name}
                                {index < (item.relations?.roles?.length || 0) - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </TableCell>
                          <TableCell>
                            {getStatusChip(item)}
                          </TableCell>

                          <TableCell>
                            <SwitchDeactivate
                              data={item}
                              action={usersActions}
                              checked={checkActiveUser(item)}
                            />
                          </TableCell>
                          <TableCell>{moment(item.created_at).format("YYYY.MM.DD HH:mm")}</TableCell>
                          <TableCell align="right">
                            <CRUDListActions
                              editLink={`${ADMIN_PATH.USERS}/${item.id}`}
                              deleteCallback={() => handleDelete(item)}
                            >
                              {item.relations?.roles?.some(
                                (role) => role.slug === ROLE_SLUGS.CLEANER
                              ) ? (
                                <Tooltip title="View">
                                  <Link
                                    href={`${ADMIN_PATH.USERS}/${item.id}/view`}
                                  >
                                    <IconButton>
                                      <VisibilityOutlinedIcon />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                              ) : null}
                            </CRUDListActions>
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

export default UsersList;

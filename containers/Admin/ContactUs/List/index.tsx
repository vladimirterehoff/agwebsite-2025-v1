import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { AppState } from "@/app-redux/state";
import { contactUsActions } from "@/app-redux/contactUs/actions";
import { CONTACT_US_RELATIONS } from "@/app-redux/contactUs/relations";
import {
  Box,
  Table,
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import { useCrudList } from "@/hooks/crud/useCrudList";
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import styles from "./style.module.scss";
import { enumToSelectList } from "@/helpers/enumToSelectList";
import { CONTACT_US_TYPE } from "@/app-redux/contactUs/model";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const typeList = enumToSelectList(CONTACT_US_TYPE);

const ContactUsList = () => {
  const { loading, list, pagination, options } = useSelector(
    (state: AppState) => state.contactUs
  );

  const { getList, paginationEl, deleteModal, filter, searchEl, sortBlock } =
    useCrudList(contactUsActions, pagination);

  const [typeFilter, setTypeFilter] = useState<string>("not_selected");

  useEffect(() => {
    filter.sort('-id');
    filter.expand([
      CONTACT_US_RELATIONS.USER,
      CONTACT_US_RELATIONS.USER_AVATAR,
    ]);
    filter.searchItems([
      "id",
      "email",
      "type",
      "description",
      "user.first_name",
      "user.last_name",
      "user.full_name",
    ]);
    getList();
  }, []);

  useEffect(() => {
    contactUsActions.getOptions();
  }, []);

  const changeTypeFilter = () => {
    if (typeFilter === "not_selected") {
      filter.builder.remove("type");
    } else {
      filter.builder.in("type", [typeFilter]);
    }
    getList();
  };
  const getTypeName = (type: string) => {
    const option = options.find(option => option.key === type);

    return option?.name;
  };

  useEffect(changeTypeFilter, [typeFilter]);

  return (
    <>
      <ContentHeader
        title="Contact Us"
        needAddLink={false}
        modelName="Contact Us"
        urlSlug={ADMIN_PATH.CONTACT_US}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Contact Us" },
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

        {options?.length ? (
          <Grid item xs={12} sm={3}>
            <FormControl variant="filled" style={{ width: "100%" }}>
              <InputLabel id="type-filter-select-label">
                Filter by type
              </InputLabel>
              <Select
                value={typeFilter}
                name={"type"}
                label="Filter by type"
                defaultValue={"not_selected"}
                fullWidth
                variant="filled"
                onChange={(event) => {
                  setTypeFilter(event.target.value);
                }}
                labelId="type-filter-select-label"
                sx={{
                  borderTopLeftRadius: { sm: 0 },
                }}
              >
                <MenuItem value="not_selected">All</MenuItem>
                {options.map((item) => (
                  <MenuItem key={item.key} value={item.key}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : null}
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
                      <TableCell width={"80px"}>ID {sortBlock("id")}</TableCell>
                      <TableCell>
                        User {sortBlock("user.first_name")}
                      </TableCell>
                      <TableCell>Email {sortBlock("email")}</TableCell>
                      <TableCell>Type {sortBlock("type")}</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => (
                      <React.Fragment key={item.id}>
                        <TableRow hover>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>
                            {
                              item.relations?.user
                                ? <Link href={`${ADMIN_PATH.USERS}/${item.user_id}/view`}>
                                   {item.relations?.user?.full_name}
                                  </Link>
                                : 'Deleted User'
                            }
                          </TableCell>
                          <TableCell>
                            <a
                              href={`mailto:${
                                item.email
                              }?subject=${encodeURIComponent(
                                `RE: ${item.type}`
                              )}&body=${encodeURIComponent(
                                `\n\nThis is answer to your question:\n\t${item.description}`
                              )}`}
                              className="link"
                            >
                              {item.email}
                            </a>
                          </TableCell>
                          <TableCell>{getTypeName(item.type)}</TableCell>
                          <TableCell align="right">
                            <Link
                              href={`${ADMIN_PATH.CONTACT_US}/${item.id}/view`}
                            >
                              <Tooltip title="View">
                                <IconButton>
                                  <VisibilityOutlinedIcon />
                                </IconButton>
                              </Tooltip>
                            </Link>
                          </TableCell>
                        </TableRow>
                        <TableRow hover>
                          <TableCell colSpan={6}>
                            <b>Description:</b>
                            <br />
                            <span style={{ wordBreak: "break-word" }}>
                              {item.description || "-"}
                            </span>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              {list.length === 0 && <p className="emptyList">List is empty</p>}

              {paginationEl}
            </>
          )}
        </div>
        {deleteModal}
      </Card>
    </>
  );
};

export default ContactUsList;

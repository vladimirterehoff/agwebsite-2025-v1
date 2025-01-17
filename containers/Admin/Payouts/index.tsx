import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "@/app-redux/state";
import { providersActions } from "@/app-redux/providers/actions";
import { PROVIDER_RELATIONS } from "@/app-redux/providers/relations";
import {
  Box,
  Table,
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// Components
import Loader from "@/components/Common/Loader";
import Button from "@/components/Common/Button";
import ProviderLink from "@/components/Admin/ProviderLink";
import ContentHeader from "@/components/Admin/ContentHeader";

import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";

import { useCrudList } from "@/hooks/crud/useCrudList";
import { notify } from "@/helpers/notify";
import { CURRENCY } from "@/utils/constants";

import AddIcon from "@mui/icons-material/Add";

/**
 * Payouts list
 */
const PayoutList = () => {
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.providers
  );

  const { getList, paginationEl, filter, searchEl, sortBlock } = useCrudList(
    providersActions,
    pagination
  );

  const [typeFilter, setTypeFilter] = useState<string>("not_selected");
  const filterList = [
    { id: "mobile", name: "Cleaner" },
    { id: "stationary", name: "Workshop" },
  ];

  const [paidFilter, setPaidFilter] = useState<string>("not_selected");
  const paidFilterList = [
    { id: "paid", name: "Paid" },
    { id: "unpaid", name: "Unpaid" },
  ];

  useEffect(() => {
    filter.expand([PROVIDER_RELATIONS.WALLET, PROVIDER_RELATIONS.USER]);
    filter.searchItems(["translations.name", "id"]);
  }, [filter]);

  const changeFilterByType = () => {
    if (typeFilter === "not_selected") {
      filter.builder.remove("type");
    } else {
      filter.builder.in("type", [typeFilter]);
    }
  };

  const changeFilterByPaid = () => {
    if (paidFilter === "not_selected") {
      filter.builder.remove("wallet.balance");
    } else if (paidFilter === "paid") {
      filter.builder.equal("wallet.balance", 0);
    } else if (paidFilter === "unpaid") {
      filter.builder.greater("wallet.balance", 0);
    }
  };

  useEffect(() => {
    changeFilterByType();
    changeFilterByPaid();
    getList();
  }, [typeFilter, paidFilter]);

  const handleExport = async () => {
    try {
      await providersActions.exportTable(filter.filter);
    } catch (error) {
      notify.error("Error! Failed to download the report file.");
      console.error(error);
    }
  };

  return (
    <>
      <ContentHeader
        title="Payouts"
        needAddLink={false}
        modelName="Providers"
        urlSlug={ADMIN_PATH.PAYOUTS}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Payouts" },
        ]}
      >
        <Box>
          <Tooltip title="Export to *.csv">
            <IconButton onClick={handleExport}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </ContentHeader>

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
            <InputLabel id="type-filter-select-label">Filter by type</InputLabel>
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
                borderTopRightRadius: { sm: 0 },
                borderRight: { sm: "1px solid #838486" },
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

        <Grid item xs={12} sm={3}>
          <FormControl variant="filled" style={{ width: "100%" }}>
            <InputLabel id="paid-filter-select-label">Filter by left to pay</InputLabel>
            <Select
              value={paidFilter}
              name={"paid"}
              label="Filter by left to pay"
              defaultValue={"not_selected"}
              fullWidth
              variant="filled"
              onChange={(event) => {
                setPaidFilter(event.target.value);
              }}
              labelId="paid-filter-select-label"
              sx={{
                borderTopLeftRadius: { sm: 0 },
              }}
            >
              <MenuItem value={`not_selected`}>All</MenuItem>
              {paidFilterList.map((item) => (
                <MenuItem key={item.name} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Card>
        <Box className="admin-table">
          <Loader isLoading={loading} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID {sortBlock("id")}</TableCell>
                <TableCell>Name {sortBlock("name", "en")}</TableCell>
                <TableCell>Bank Details {sortBlock("bank_details")}</TableCell>
                <TableCell>
                  Completed Orders {sortBlock("orders_count")}
                </TableCell>
                <TableCell>
                  Total Earned {sortBlock("total_earned")}
                </TableCell>
                <TableCell>Paid {sortBlock("total_withdrawn")}</TableCell>
                <TableCell>Left to Pay {sortBlock("wallet.balance")}</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => {
                return (
                  <TableRow hover key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <ProviderLink provider={item} />
                    </TableCell>
                    <TableCell>{item.bank_details || "-"}</TableCell>
                    <TableCell>{item.orders_count || 0}</TableCell>
                    <TableCell align="right">
                      {CURRENCY}
                      {(
                        Number(item.total_withdrawn) +
                        Number(item.relations?.wallet?.balance)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {CURRENCY}
                      {item.total_withdrawn}
                    </TableCell>
                    <TableCell align="right">
                      {CURRENCY}
                      {item.relations?.wallet?.balance}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Create Withdrawal">
                        <div>
                          <Button
                            size="small"
                            href={`${ADMIN_PATH.WITHDRAWALS}/add?providerId=${item.id}`}
                            variant="outlined"
                          >
                            <AddIcon />
                            <span
                              style={{
                                whiteSpace: "nowrap",
                                textTransform: "none",
                              }}
                            >
                              Withdrawal
                            </span>
                          </Button>
                        </div>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {list.length === 0 && <p className="emptyList">List is empty</p>}
          {paginationEl}
        </Box>
      </Card>
    </>
  );
};

export default PayoutList;

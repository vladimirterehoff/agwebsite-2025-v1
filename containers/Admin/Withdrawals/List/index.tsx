// Libs
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FormProvider, useForm } from "react-hook-form";
// Redux
import { AppState } from "@/app-redux/state";
import { WITHDRAWAL_RELATIONS_LIST } from "@/app-redux/withdrawals/relations";
import { withdrawalsActions } from "@/app-redux/withdrawals/actions";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import ProviderLink from "@/components/Admin/ProviderLink";
import DatePicker from "@/components/Common/FormComponents/DatePicker";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
// Constants
import { ADMIN_MAIN, ADMIN_PATH } from "@/utils/routers/admin";
// Helpers
import { notify } from "@/helpers/notify";


/**
 * Withdrawals List Container
 * @constructor
 */
const WithdrawalsList = () => {
  const { list, loading, pagination } = useSelector(
    (state: AppState) => state.withdrawals
  );

  // Set default filters 
  useEffect(() => {
    filter.sort("-created_at");
    filter.searchItems([
      "id",
      "amount",
      "comment",
      "provider.translations.name",
    ]);
    filter.expand(WITHDRAWAL_RELATIONS_LIST);
  }, []);

  // State
  const [dateFrom, setDateFrom] = useState<string>(
    moment().subtract(1, "year").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState<string>(moment().format("YYYY-MM-DD"));

  // hooks
  const formHook = useForm();

  useEffect(() => {  
    // Date Range Filter
    filter.builder.fromTo("created_at", dateFrom, dateTo);
    getList();
  }, [dateFrom, dateTo]);

  const { getList, filter, searchEl, sortBlock, paginationEl } = useCrudList(
    withdrawalsActions,
    pagination
  );

  const handleExport = async () => {
    try {
      await withdrawalsActions.exportTable({
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      });
    } catch (error) {
      notify.error("Error! Failed to download the report file.");
      console.error(error);
    }
  };

  return (
    <>
      <Box>
        <ContentHeader
          title="Withdrawals"
          needAddLink={true}
          modelName="Withdrawals"
          urlSlug={ADMIN_PATH.WITHDRAWALS}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: false, text: "Withdrawals" },
          ]}
        ></ContentHeader>

        

        <FormProvider {...formHook}>
          <form noValidate>
            <Grid container spacing={2} mb={2}>
              <Grid item flex={1}>
                <DatePicker
                  defaultValue={dateFrom}
                  name="date_from"
                  size="small"
                  label={"Date from"}
                  onChange={(value) => {
                    setDateFrom(moment(value).format("YYYY-MM-DD"));
                  }}
                />
              </Grid>
              <Grid item flex={1}>
                <DatePicker
                  defaultValue={dateTo}
                  name="date_to"
                  size="small"
                  label="Date to"
                  onChange={(value) => {
                    setDateTo(moment(value).format("YYYY-MM-DD"));
                  }}
                />
              </Grid>

              <Grid item>
                <Box>
                  <Tooltip title="Export to *.csv">
                    <IconButton onClick={handleExport}>
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </form>
        </FormProvider>

        {searchEl("Search")}

        <Card>
          <Loader isLoading={loading} />
          <Box className="admin-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID {sortBlock("id")}</TableCell>
                  <TableCell>Provider Name</TableCell>
                  <TableCell>Amount {sortBlock("amount")}</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Created at {sortBlock("created_at")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <ProviderLink provider={item?.relations?.provider} />
                    </TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.comment}</TableCell>
                    <TableCell>
                      {moment(item.created_at).format("YYYY.MM.DD HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      </Box>

      {list.length == 0 && <p className="emptyList">List is empty</p>}

      {paginationEl}
    </>
  );
};

export default WithdrawalsList;

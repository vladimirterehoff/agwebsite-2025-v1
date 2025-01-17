// Libs
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import moment from "moment";
// Redux
import { AppState } from "@/app-redux/state";
import { reportsCleanerActions } from "@/app-redux/reportsCleaner/actions";
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
  Grid, Link,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import DatePicker from "@/components/Common/FormComponents/DatePicker";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
// Utils
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import { notify } from "@/helpers/notify";

const CleanerReportsList = () => {
  const [dateFrom, setDateFrom] = useState<string>(
    moment().subtract(1, "month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState<string>(moment().format("YYYY-MM-DD"));

  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.reportsCleaner
  );
  const formHook = useForm();
  const { watch } = formHook;

  const { paginationEl, filter, searchEl, sortBlock } = useCrudList(
    reportsCleanerActions,
    pagination
  );

  useEffect(() => {
    filter.searchItems(["id", "name", "email", "phone"]);
    reportsCleanerActions.get(
      undefined,
      `${filter.filter}&date_from=${dateFrom}&date_to=${dateTo}`
    );
  }, [dateFrom, dateTo]);

  const handleExport = async () => {
    try {
      await reportsCleanerActions.exportTable({
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      date_to: moment(dateTo).format("YYYY-MM-DD"),
      });
    } catch (error) {
      notify.error("Error! Can't download report file.");
      console.error(error);
    }
  };

  return (
    <>
      <ContentHeader
        title="Cleaner Reports"
        needAddLink={false}
        modelName="Cleaner Reports"
        urlSlug={ADMIN_PATH.CLEANER_REPORTS}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Cleaner Reports" },
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

      <FormProvider {...formHook}>
        <form noValidate>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <DatePicker
                defaultValue={dateFrom}
                // format="dd.MM.yyyy"
                name="date_from"
                size="small"
                label={"From"}
                maxDate={watch("date_to")}
                onChange={(value) => {
                  setDateFrom(moment(value).format("YYYY-MM-DD"));
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                name="date_to"
                size="small"
                label="Date To"
                defaultValue={dateTo}
                minDate={watch("date_from")}
                onChange={(value) => {
                  setDateTo(moment(value).format("YYYY-MM-DD"));
                }}
              />
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      <Card>
        <div className="relative">
          <Loader isLoading={loading} />

          {list && (
            <>
              <Box className="admin-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>
                        Order Finished Count {sortBlock("order_finished_count")}
                      </TableCell>
                      <TableCell>
                        Order Declined Count {sortBlock("order_declined_count")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => (
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>
                          <Link
                            href={`${ADMIN_PATH.USERS}/${item.user_id}/view`}
                            underline="hover"
                          >
                            {item.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`mailto:${item.email}`}
                          >
                            {item.email}
                          </Link>
                        </TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{Number(item.rating).toFixed(2)}</TableCell>
                        <TableCell>{item.order_finished_count}</TableCell>
                        <TableCell>{item.order_declined_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              {list.length === 0 && <p className="emptyList">List is empty</p>}

              {paginationEl}
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default CleanerReportsList;

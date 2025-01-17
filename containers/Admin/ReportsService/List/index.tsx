import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "@/app-redux/state";
import { reportsServiceActions } from "@/app-redux/reportsService/actions";
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
} from "@mui/material";
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import { useCrudList } from "@/hooks/crud/useCrudList";
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import moment from "moment";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { notify } from "@/helpers/notify";
import { FormProvider, useForm } from "react-hook-form";
import DatePicker from "@/components/Common/FormComponents/DatePicker";

const ServiceReportsList = () => {
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.reportsService
  );
  const [dateFrom, setDateFrom] = useState<string>(
    moment().subtract(1, "month").format("YYYY-MM-DD")
  );
  const [dateTo, setDateTo] = useState<string>(moment().format("YYYY-MM-DD"));

  const formHook = useForm();
  const { watch } = formHook;

  const {
    getList,
    paginationEl,
    filter,
    searchEl,
    sortBlock,
  } = useCrudList(reportsServiceActions, pagination);

  useEffect(() => {
    filter.expand(["service"]);
    filter.searchItems(["service.translations.name"]);
    getList();
  }, []);

  useEffect(() => {
    filter.searchItems(["id", "name", "email", "phone"]);
    filter.params([
      {key: 'date_from', value: dateFrom},
      {key: 'date_to', value: dateTo}
    ]);
    reportsServiceActions.get(
      undefined,
      `${filter.filter}`
    );
  }, [dateFrom, dateTo]);

  const handleExport = async () => {
    try {
      await reportsServiceActions.exportTable({
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
        title="Service Reports"
        needAddLink={false}
        modelName="Service Reports"
        urlSlug={ADMIN_PATH.SERVICE_REPORTS}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Service Reports" },
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
                      <TableCell>Order Count</TableCell>
                      <TableCell>Unique User Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => (
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.order_count}</TableCell>
                        <TableCell>{item.unique_user_count}</TableCell>
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

export default ServiceReportsList; 

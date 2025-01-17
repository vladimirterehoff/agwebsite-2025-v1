// Libs
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import moment from "moment";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
// Redux
import { AppState } from "@/app-redux/state";
import { ORDER_RELATIONS } from "@/app-redux/orders/relations";
import { ordersActions } from "@/app-redux/orders/actions";
import {Order, ORDER_STATUS, ORDER_TYPE, WORKSHOP_ORDER_STATUS, WORKSHOP_ORDER_TYPE} from "@/app-redux/orders/model";
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
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import DatePicker from "@/components/Common/FormComponents/DatePicker";
import OrderForm from "./OrderForm";
import Select from "@/components/Common/FormComponents/Select";
import Button from "@/components/Common/Button";
import CounterNumber from "@/components/Admin/CounterNumber";
import ProviderLink from "@/components/Admin/ProviderLink";
// Icons
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
// Hooks
import { useCrudList } from "@/hooks/crud/useCrudList";
import { useSaveQuery } from "@/hooks/useSaveQuery";
import { useDialog } from "@/hooks/dialog/useDialog";
import { useConfirm } from "@/hooks/dialog/useConfirm";
import useCheckRole from "@/hooks/useIsAdmin";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import { CURRENCY } from "@/utils/constants";
// Helpers
import { enumToSelectList } from "@/helpers/enumToSelectList";
import { notify } from "@/helpers/notify";
// Styles
import styles from "../style.module.scss";
import {providersUrl} from "@/app-redux/providers/actions";
import {Provider} from "@/app-redux/providers/model";
import {getProviderName} from "@/helpers/getProviderName";
import Autocomplete from "@/components/Common/FormComponents/Autocomplete";
import {usePermissions} from "@/hooks/access/usePermissions";
import {PERMISSION_SLUGS} from "@/app-redux/roles/model";


export enum ORDER_SCOPES {
  ALL = "all",
  REFUNDABLE = "refundable",
}

/**
 * Orders List Container
 * @constructor
 */
const OrdersList = () => {
  // Store
  const { loading, list, pagination } = useSelector(
    (state: AppState) => state.orders
  );

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
  } = useCrudList(ordersActions, pagination);
  const formHook = useForm();
  const { watch } = formHook;
  const { isSuperAdmin, isWorkshopManager } = useCheckRole();

  const { hasPermissions } = usePermissions();

  let statusList, typeList;

  if (hasPermissions([PERMISSION_SLUGS.WORKSHOP_MANAGER])) {
    statusList = WORKSHOP_ORDER_STATUS;
    typeList = WORKSHOP_ORDER_TYPE;
  } else {
    statusList = ORDER_STATUS;
    typeList = ORDER_TYPE;
  }

  typeList = enumToSelectList(typeList, true);
  statusList = enumToSelectList(statusList, true);

  // State
  const [statusFilter, setStatusFilter] = useState(
    query?.status
      ? statusList.find((i) => i.id === `${query?.status}`)
      : statusList[0]
  );
  const [dateTo, setDateTo] = useState<string>(moment().format("YYYY-MM-DD"));
  const [dateFrom, setDateFrom] = useState<string>(
    moment().subtract(1, "year").format("YYYY-MM-DD")
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [typeFilter, setTypeFilter] = useState(typeList[0]);
  const [refundOrder, setRefundOrder] = useState<Order | null>(null);
  const [sendMoneyOrder, setSendMoneyOrder] = useState<Order | null>(null);
  const [currentScope, setCurrentScope] = useState(ORDER_SCOPES.ALL);
  const [refundableNumber, setRefundableNumber] = useState(0);
  const [provider, setProvider] = useState<any>(query?.provider_id);

  const handleExport = async () => {
    try {
      await ordersActions.exportTable(
        `${filter.filter}${
          currentScope === ORDER_SCOPES.REFUNDABLE
            ? '&scopes=[{"name":"refundable","parameters":[]}]'
            : ""
        }`
      );
    } catch (error) {
      notify.error("Error! Can't download report file.");
      console.error(error);
    }
  };

  /**
   * Change availability filter
   */
  const changeAvailabilityFilter = () => {
    saveQuery({
      status:
        statusFilter?.id === "not_selected" || !statusFilter
          ? null
          : statusFilter.id,
      type:
        typeFilter?.id === "not_selected" || !typeFilter ? null : typeFilter.id,
    });
  };

  /**
   * Edit Dialog
   */
  const [editDialog, openEditDialog, closeEditDialog] = useDialog({
    title: "Edit Order",
    content: (
      <OrderForm
        data={selectedOrder}
        key={`order-form-${selectedOrder?.id}`}
        closeEditDialog={() => {
          closeEditDialog();
        }}
        onSubmitCallback={() => {
          getList();
          closeEditDialog();
        }}
      />
    ),
    maxWidth: "sm",
  });

  const handleRefund = (order: Order) => {
    setRefundOrder(order);
    openRefundDialog();
  };

  const getRefundableNumber = async () => {
    ordersActions.getRefundableNumber();
    const number = await ordersActions.getRefundableNumber(
      filter.filter,
      false
    );
    setRefundableNumber(number);
  };

  const handleRefundConfirm = async () => {
    if (refundOrder) {
      try {
        await ordersActions.refund(refundOrder.id);
        notify.success("Order refunded successfully");
        getList();

        getRefundableNumber();
      } catch (error) {
        notify.error("Error! Can't refund order.");
      }
    }
  };

  const handleSendMoney = (order: Order) => {
    setSendMoneyOrder(order);
    openSendMoneyDialog();
  };

  const handleSendMoneyConfirm = async () => {
    if (sendMoneyOrder) {
      try {
        await ordersActions.sendMoney(sendMoneyOrder.id);
        notify.success("Money sent to provider successfully");
        getList();

        getRefundableNumber();
      } catch (error) {
        notify.error("Error! Can't send money to provider.");
      }
    }
  };

  /**
   * Refund Dialog
   */
  const [refundDialog, openRefundDialog, closeRefundDialog] = useConfirm(
    "Refund Order",
    "Are you sure you want to refund this order?",
    () => {
      handleRefundConfirm();
    }
  );

  /**
   * Send Money Dialog
   */
  const [sendMoneyDialog, openSendMoneyDialog, closeSendMoneyDialog] =
    useConfirm(
      "Send Money to Provider",
      `Are you sure you want to send money to ${
        sendMoneyOrder?.relations?.provider?.name?.en || "provider"
      }?`,
      () => {
        handleSendMoneyConfirm();
      }
    );

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    openEditDialog();
  };

  /**
   * LIFE CYCLES
   */
  useEffect(changeAvailabilityFilter, [statusFilter, typeFilter]);

  // Set basic filters
  useEffect(() => {
    filter.expand(Object.values(ORDER_RELATIONS));
    filter.sort("-created_at");
  }, []);

  useEffect(() => {
    // Status Filter
    if (statusFilter?.id === "not_selected") {
      filter.builder.remove("status");
    } else {
      filter.builder.in("status", [statusFilter?.id]);
    }

    // Type Filter
    if (typeFilter?.id === "not_selected") {
      filter.builder.remove("type");
    } else {
      filter.builder.in("type", [typeFilter.id]);
    }

    // Provider Filter
    if (!provider) {
      filter.builder.remove("provider_id");
    } else {
      filter.builder.in("provider_id", [provider]);
    }

    // Date Range Filter
    filter.builder.fromTo("created_at", dateFrom, dateTo);

    filter.expand(Object.values(ORDER_RELATIONS));
    filter.searchItems([
      "id",
      "code",
      "user.email",
      "user.first_name",
      "user.last_name",
      "user.full_name",
      // "provider.translations.name",
    ]);

    // filter.scope({ name: 'refundable', parameters: []})
    ordersActions.get(undefined, `${filter.filter}`);
    getRefundableNumber();
  }, [dateFrom, dateTo, statusFilter, typeFilter, provider]);

  return (
    <>
      <ContentHeader
        title="Orders"
        needAddLink={false}
        modelName="Orders"
        urlSlug={ADMIN_PATH.ORDERS}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          { url: false, text: "Orders" },
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

      <Loader isLoading={loading} />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={currentScope}
          onChange={(_, newValue) => {
            setCurrentScope(newValue);
            filter.clearScope();
            if (newValue !== ORDER_SCOPES.ALL) {
              filter.scope({ name: newValue, parameters: [] });
            }
            getList();
          }}
        >
          <Tab label="All" value={ORDER_SCOPES.ALL} />
          <Tab
            label={
              <Box display={"flex"}>
                Refundable <CounterNumber number={refundableNumber} />
              </Box>
            }
            value={ORDER_SCOPES.REFUNDABLE}
          />
        </Tabs>
      </Box>

      <FormProvider {...formHook}>
        <form noValidate>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item flex={1}>
              <DatePicker
                defaultValue={dateFrom}
                name="date_from"
                size="small"
                label={"Date from"}
                maxDate={watch("date_to")}
                onChange={(value) => {
                  setDateFrom(moment(value).format("YYYY-MM-DD"));
                }}
              />
            </Grid>
            <Grid item flex={1}>
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

          <Grid container spacing={0}>
            <Grid item xs={12} sm={5}>
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
            <Grid item xs={12} sm={2}>
              <Select
                value={statusFilter}
                name={"status"}
                label="Status"
                fullWidth
                variant="filled"
                onChange={(_, newValue) => {
                  setStatusFilter(newValue);
                }}
                variants={statusList}
                sx={{
                  borderTopLeftRadius: { sm: 0 },
                  borderTopRightRadius: { sm: 0 },
                  borderRight: { sm: "1px solid #838486" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Select
                value={typeFilter}
                name={"type"}
                label="Type"
                fullWidth
                variant="filled"
                onChange={(_, newValue) => {
                  setTypeFilter(newValue);
                }}
                variants={typeList}
                sx={{
                  borderTopLeftRadius: { sm: 0 },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Autocomplete
                onChange={(e) => setProvider(e?.id ?? '')}
                name={"provider_id"}
                searchParams={{
                  url: providersUrl,
                  searchBy: ["translations.name", "user.first_name", "user.last_name", "user.full_name"],
                  expand: ['user', 'translations']
                }}
                label={"Workshop/Cleaner"}
                labelName={"name"}
                defaultValue={{id: provider, name: query?.provider_name}}
                getName={(provider: Provider) => getProviderName(provider)}
                multilang
              />
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      <Card>
        <div className="relative">
          {list && (
            <>
              <Box className="admin-table admin-table-small">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID {sortBlock("id")}</TableCell>
                      <TableCell>Code {sortBlock("code")}</TableCell>
                      <TableCell>Address {sortBlock("address")}</TableCell>
                      <TableCell>Type {sortBlock("type")}</TableCell>
                      <TableCell>Status {sortBlock("status")}</TableCell>
                      <TableCell>
                        Vehicle Type {sortBlock("vehicle.vehicleType.name.en")}
                      </TableCell>
                      <TableCell>
                        Vehicle {sortBlock("vehicle.manufacturer.name")}
                      </TableCell>
                      <TableCell>Total {sortBlock("total")}</TableCell>
                      <TableCell>Total Transferred </TableCell>

                      <TableCell>Services</TableCell>
                      <TableCell width={100}>Client Name</TableCell>
                      <TableCell>Client Phone Number</TableCell>
                      <TableCell>Order Rating</TableCell>
                      <TableCell>Assigned Workshop/Cleaner</TableCell>
                      <TableCell width={110}>
                        Created at {sortBlock("created_at")}
                      </TableCell>

                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item) => {
                      return (
                        <TableRow hover key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>
                            <Tooltip title={item.address}>
                              <div
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 150,
                                }}
                              >
                                {item.address}
                              </div>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>
                            {item.status
                              .replace(/_/g, " ")
                              .replace(/^\w/, (c) => c.toUpperCase())}
                          </TableCell>

                          <TableCell>
                            {
                              item.relations?.vehicle?.relations?.vehicleType
                                ?.name.en
                            }
                          </TableCell>
                          <TableCell>
                            {
                              item.relations?.vehicle?.relations?.manufacturer
                                ?.name
                            }{" "}
                            {item.relations?.vehicle?.model} (
                            {item.relations?.vehicle?.license_plate})
                          </TableCell>
                          <TableCell>
                            {CURRENCY}
                            {item.total}
                          </TableCell>
                          <TableCell>
                            {CURRENCY}
                            {item.total_transferred}
                          </TableCell>

                          {/* List of provided Services */}
                          <TableCell>
                            <ul className={styles.listServices}>
                              {item?.relations?.items?.map((item: any) => {
                                return (
                                  <li>
                                    {item?.relations?.service?.id ? (
                                      isSuperAdmin ? (
                                        <Link
                                          href={`${ADMIN_PATH.SERVICES}/${item?.relations?.service.id}`}
                                        >
                                          {item?.relations?.service?.name?.en}
                                        </Link>
                                      ) : (
                                        <>
                                          {item?.relations?.service?.name?.en}
                                        </>
                                      )
                                    ) : (
                                      <>Deleted service</>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </TableCell>

                          {/* Client Name */}
                          <TableCell>
                            {item?.relations?.user === null ? 'Deleted user' : 
                              isWorkshopManager ? item?.relations?.user?.full_name : <Link
                                href={`${ADMIN_PATH.USERS}/${item?.user_id}/view`}
                              >
                                {item?.relations?.user?.full_name}
                              </Link>
                            }
                          </TableCell>

                          {/* Client Phone Number */}
                          <TableCell>
                            {item?.relations?.user
                              ? item?.relations?.user?.phone
                              : "-"}
                          </TableCell>

                          {/* Order Rating */}
                          <TableCell>
                            {item?.relations?.review?.rating !== undefined
                              ? Number(item.relations.review.rating).toFixed(2)
                              : "-"}
                          </TableCell>

                          {/* Assigned Workshop/Cleaner */}
                          <TableCell>
                            {
                              item?.relations?.provider
                                ? <ProviderLink
                                      provider={item?.relations?.provider}
                                  />
                                : item?.provider_id ? 'Deleted' : '-'
                            }
                          </TableCell>

                          {/* Created at */}
                          <TableCell>
                            {moment(item.created_at).format("YYYY.MM.DD HH:mm")}
                          </TableCell>

                          <TableCell align="right">
                            {/* ACTION BUTTONS */}
                            <Box
                              display={"flex"}
                              flexWrap={"wrap"}
                              minWidth={120}
                              alignItems={"center"}
                              justifyContent={"flex-end"}
                            >
                              <Link
                                href={`${ADMIN_PATH.ORDERS}/${item.id}/view`}
                              >
                                <Tooltip title="View">
                                  <IconButton>
                                    <VisibilityOutlinedIcon />
                                  </IconButton>
                                </Tooltip>
                              </Link>

                              {
                                currentScope !== ORDER_SCOPES.REFUNDABLE &&
                                <Tooltip title="Edit">
                                  <IconButton onClick={() => handleEdit(item)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              }

                              {currentScope === ORDER_SCOPES.REFUNDABLE && (
                                <>
                                  <Tooltip title="Refund money to Client">
                                    <IconButton
                                      onClick={() => handleRefund(item)}
                                    >
                                      <MoneyOffIcon />
                                    </IconButton>
                                  </Tooltip>

                                  <Tooltip title="Transfer money to Provider">
                                    <IconButton
                                      disabled={!item?.relations?.provider}
                                      onClick={() => handleSendMoney(item)}
                                    >
                                      <PaidOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                            </Box>
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
        {editDialog}
        {refundDialog}
        {sendMoneyDialog}
        {/* {filterDialog} */}
      </Card>
    </>
  );
};

export default OrdersList;

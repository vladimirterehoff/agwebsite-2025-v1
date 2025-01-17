import React, {useEffect, useMemo, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {ordersActions} from "@/app-redux/orders/actions";
import {Order, ORDER_STATUS, ORDER_TYPE} from "@/app-redux/orders/model";
import {Box, Button, Grid} from "@mui/material";
import {notify} from "@/helpers/notify";
import Select from "@/components/Common/FormComponents/Select";

interface OrderFormValues {
  id: number;
  status: any;
  // start_datetime: string | null;
  // end_datetime: string | null;
  // decline_reason: string | null;
  // decline_description: string | null;
}

const fullList = [
  { id: ORDER_STATUS.FINISHED, name: "Finished", disabled: false },
  { id: ORDER_STATUS.DECLINED, name: "Declined", disabled: false },
]

const OrderForm = (params: { data: Order | null, onSubmitCallback: () => void, closeEditDialog: () => void }) => {

  const { data, onSubmitCallback, closeEditDialog } = params;
  const formHook = useForm<OrderFormValues>();
  const { handleSubmit, reset, formState: { errors } } = formHook;

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        status: '',
        // start_datetime: data.start_datetime ? moment(data.start_datetime).format('YYYY-MM-DD HH:mm') : null,
        // end_datetime: data.end_datetime ? moment(data.end_datetime).format('YYYY-MM-DD HH:mm') : null,
      });
    }
  }, [data]);

  const onSubmitAction = async (formData: OrderFormValues) => {
    try {
      if (formData.status?.id) {
        formData.status = formData.status.id
        await ordersActions.submit(formData);
        notify.success("Order updated successfully!");
      } else {
        notify.error("Error updating order.");
      }

      onSubmitCallback();
    } catch (error) {
      notify.error("Error updating order.");
    }
  };

  const statusList = useMemo(() => {
    if (!data || !fullList) return [];

    const currentStatus = data.status;
    const isStationaryOrder = data.type === ORDER_TYPE.STATIONARY;

    const notAllowedDeclineStatuses = [
      ORDER_STATUS.WORK_STARTED,
      ORDER_STATUS.FINISHED,
      ORDER_STATUS.DECLINED_BY_CUSTOMER,
      ORDER_STATUS.DECLINED_BY_CLEANER,
      ORDER_STATUS.DECLINED,
    ];

    const allowedFinishStatuses = [
      ORDER_STATUS.PLACED,
      ORDER_STATUS.UPCOMING,
      ORDER_STATUS.SCHEDULED,
    ];

    // Map through the full list of statuses
    return fullList.map((status) => {
      let disabled = false;

      if (status.id === ORDER_STATUS.DECLINED) {
        disabled = notAllowedDeclineStatuses.includes(currentStatus);
      } else if (isStationaryOrder) {
        disabled = !allowedFinishStatuses.includes(currentStatus);
      }

      if (status.id === currentStatus || (!isStationaryOrder && status.id !== ORDER_STATUS.DECLINED)) {
        disabled = true;
      }

      return { ...status, disabled };
    });
  }, [data, fullList]);

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onSubmitAction)} noValidate>
        <Box pt={1}>
          <Grid container spacing={2} rowGap={1}>
            <Grid item xs={12}>
              <Select
                name="status"
                label="Status"
                variants={statusList}
                fullWidth
                error={Boolean(errors.status?.message)}
                helperText={errors.status?.message}
                required
                size="small"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <DateTimePicker 
                name="start_datetime"
                label="Start Date and Time"
                // fullWidth
                required
                error={Boolean(errors.start_datetime?.message)}
                helperText={errors.start_datetime?.message}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker 
                name="end_datetime"
                label="End Date and Time"
                // fullWidth
                required
                error={Boolean(errors.end_datetime?.message)}
                helperText={errors.end_datetime?.message}
                size="small"
              />
            </Grid> */}
            {/* <Grid item xs={12}>
              <TextField
                name="decline_reason"
                label="Decline Reason"
                multiline
                minRows={1}
                fullWidth 
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="decline_description"
                label="Decline Description"
                fullWidth
                multiline
                minRows={1} 
                size="small"
              />
            </Grid> */}
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2} mt={2} mb={2}>
              <Button variant="outlined" color="primary" onClick={() => closeEditDialog()}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  );
};

export default OrderForm;

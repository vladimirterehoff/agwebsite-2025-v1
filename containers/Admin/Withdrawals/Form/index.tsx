import React, { use, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { withdrawalsActions } from "@/app-redux/withdrawals/actions";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Components
import Button from "@/components/Common/Button";
import Loader from "@/components/Common/Loader";
import TextField from "@/components/Common/FormComponents/TextField";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
// Hooks
import { useCrudForm } from "@/hooks/crud/useCrudForm";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import Autocomplete from "@/components/Common/FormComponents/Autocomplete";
import { providersActions, providersUrl } from "@/app-redux/providers/actions";

interface Props {
  id?: string;
  providerId?: string;
}

interface FormValues {
  id: number;
  provider_id: any;
  amount: string;
  comment: string;
  non_field_error: string;
}

const WithdrawalsForm = (props: Props) => {
  const { loading, data } = useSelector((state: AppState) => state.withdrawals);
  const { data: provider } = useSelector((state: AppState) => state.providers);
  const formHook = useForm<FormValues>({
    defaultValues: {
      amount: "",
      comment: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = formHook;

  const { getData, onSubmit: onSubmitForm, filter } = useCrudForm<FormValues>(
    withdrawalsActions,
    formHook,
    props.providerId ? ADMIN_PATH.PAYOUTS : ADMIN_PATH.WITHDRAWALS,
    (data) => {
      const { relations, ...otherData } = data;
      return {
        ...otherData,
        provider_id: data?.relations?.provider ? {
          id: data?.relations?.provider?.id,
          name: data?.relations?.provider?.name?.en,
        } : undefined,
      };
    }
  );

  const onSubmit = (data: FormValues) => {
    if (data.provider_id) {
      data.provider_id = data.provider_id.id;
    }
    onSubmitForm(data);
  };

  useEffect(() => {
    filter.expand(["provider"]);
  }, [provider]);

  useEffect(() => {
    if (props.id) {
      getData(Number(props.id));
    }
  }, [props.id]);

  const getProvider = () => {
    if (props.providerId) {
      providersActions.get(Number(props.providerId));
    }
  };

  useEffect(() => {
    getProvider();
  }, [props.providerId]);

  useEffect(() => {
    if (provider) {
      setValue("provider_id", { id: provider?.id, name: provider?.name?.en });
    }
  }, [provider]);

  // Unmount
  useEffect(() => {
    return () => {
      reset({
        provider_id: null,
        amount: "",
        comment: "",
      });
      providersActions.clearData();
    };
  }, []);

  return (
    <>
      <ContentHeader
        title={props.id ? "Edit Withdrawal" : "Create Withdrawal"}
        needBackLink={true}
        modelName="Withdrawals"
        urlSlug={props.providerId ? ADMIN_PATH.PAYOUTS : ADMIN_PATH.WITHDRAWALS}
        breadcrumbs={[
          { url: ADMIN_MAIN, text: "Dashboard" },
          {
            url: props.providerId ? ADMIN_PATH.PAYOUTS : ADMIN_PATH.WITHDRAWALS,
            text: props.providerId ? "Payouts" : "Withdrawals",
          },
          { url: false, text: props.id ? "Edit" : "Create" },
        ]}
      />

      <Card>
        <Box p={2}>
          <Loader isLoading={loading} />
          <CRUDNotFound loading={loading} data={data} id={props.id} />

          {((props.id && data) || !props.id) && (
            <FormProvider {...formHook}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2} mb={4} maxWidth={800}>
                  <Grid item xs={12}>
                    <Box marginRight={"auto"} mt={2}>
                      <Autocomplete
                        name={"provider_id"}
                        searchParams={{
                          url: providersUrl,
                          searchBy: ["translations.name"],
                        }}
                        label={"Provider"}
                        labelName={"name"}
                        defaultValue={
                          provider
                            ? {
                                name: provider?.name?.en,
                                id: provider?.id,
                              }
                            : undefined
                        }
                        multilang
                        error={Boolean(errors.provider_id?.message)}
                        helperText={errors.provider_id?.message}
                        disabled={Boolean(props.providerId)}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box marginRight={"auto"} mt={2}>
                      <TextField
                        name="amount"
                        label="Amount"
                        type="number"
                        required
                        error={Boolean(errors.amount?.message)}
                        helperText={errors.amount?.message}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box marginRight={"auto"} mt={2}>
                      <TextField
                        name="comment"
                        label="Comment"
                        multiline
                        rows={4}
                        error={Boolean(errors.comment?.message)}
                        helperText={errors.comment?.message}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" fullWidth={false}>
                      Submit
                    </Button>
                  </Grid>

                  {errors.non_field_error && (
                    <div className="error-text">
                      {errors.non_field_error.message}
                    </div>
                  )}
                </Grid>
              </form>
            </FormProvider>
          )}
        </Box>
      </Card>
    </>
  );
};

export default WithdrawalsForm;

// Libs
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { manufacturersActions } from "@/app-redux/manufacturers/actions";
import { MultiLangString } from "@/app-redux/COMMON/model/multilang";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Components
import Button from "@/components/Common/Button";
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import ReactHookTextField from "@/components/Common/FormComponents/TextField";
import Switch from "@/components/Common/FormComponents/Switch";
// Hooks
import { useCrudForm } from "@/hooks/crud/useCrudForm";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";

interface Props {
  id?: string;
}

interface FormValues {
  id: number;
  name: MultiLangString;
  description: MultiLangString;
  is_active: boolean;
  non_field_error: string;
}

/**
 * Static Pages Form Container
 * @param props
 * @constructor
 */
const ManufacturersForm = (props: Props) => {
  const formHook = useForm<FormValues>({});
  const { handleSubmit, formState, reset } = formHook;
  const { errors } = formState;
  const { loading, data } = useSelector(
    (state: AppState) => state.manufacturers
  );
  const { getData, onSubmit, filter } = useCrudForm<FormValues>(
    manufacturersActions,
    formHook,
    ADMIN_PATH.BRANDS
  );

  useEffect(() => {
    if (props.id) {
      getData(Number(props.id));
    }
  }, [props.id]);

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          modelName="Brand"
          urlSlug={ADMIN_PATH.BRANDS}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: ADMIN_PATH.BRANDS, text: "Vehicle Brands" },
            { url: false, text: props.id ? "Edit" : "Add" },
          ]}
        />

        <Card className="relative">
          <Box p={2}>
            <Loader isLoading={loading} />
            <CRUDNotFound loading={loading} data={data} id={props.id} />

            {((props.id && data) || !props.id) && (
              <FormProvider {...formHook}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Grid container spacing={2} mb={4}>
                    <Grid item xs={12}>
                      <Box
                        maxWidth={"600px"}
                        marginRight={"auto"}
                        mb={4}
                        mt={2}
                      >
                        <ReactHookTextField
                          name="name"
                          label={"Name"}
                          error={Boolean(errors.name?.message)}
                          helperText={errors.name?.message}
                          required
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box marginRight={"auto"}>
                        <Switch
                          name="is_active"
                          label="Is active"
                          error={Boolean(errors.is_active?.message)}
                          helperText={errors.is_active?.message}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} marginTop={5}>
                      <Button
                        type="submit"
                        fullWidth={false}
                        disabled={formState.isSubmitting}
                      >
                        Submit
                      </Button>
                    </Grid>

                    {errors["non_field_error"] && (
                      <div className="error-text">
                        {errors["non_field_error"]?.message}
                      </div>
                    )}
                  </Grid>
                </form>
              </FormProvider>
            )}
          </Box>
        </Card>
      </div>
    </>
  );
};

export default ManufacturersForm;

// Libs
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { vehicleTypeUrl } from "@/app-redux/vehicleTypes/actions";
import { vehiclesActions } from "@/app-redux/vehicles/actions";
import { manufacturersUrl } from "@/app-redux/manufacturers/actions";
import { VEHICLE_RELATIONS } from "@/app-redux/vehicles/relations";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Divider, Typography } from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import ReactHookTextField from "@/components/Common/FormComponents/TextField";
import Autocomplete from "@/components/Common/FormComponents/Autocomplete";
import FormButtons from "@/components/Common/FormComponents/FormButtons";
import Gallery from "@/components/Admin/Gallery";
// Hooks
import { useCrudForm } from "@/hooks/crud/useCrudForm";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";

interface Props {
  id?: string;
}

interface FormValues {
  id: number;
  model: string;
  body_type: string;
  license_plate: string;
  color: string;
  manufacturer_id: number;
  vehicle_type_id: number;
  non_field_error: string;
  photos_interior: string[];
  photos_exterior: string[];
}

/**
 * Vehicle Types Form Container
 * @param props
 * @constructor
 */
const VehicleForm = (props: Props) => {
  const formHook = useForm<FormValues>({});
  const { handleSubmit, formState, getValues, watch } = formHook;
  const { errors } = formState;
  const { loading, data } = useSelector((state: AppState) => state.vehicles);
  const { getData, onSubmit, filter } = useCrudForm<FormValues>(
    vehiclesActions,
    formHook,
    ADMIN_PATH.VEHICLES,
    (data) => {
      return {
        id: data.id,
        model: data.model,
        body_type: data.body_type,
        license_plate: data.license_plate,
        color: data.color,
        manufacturer_id: {
          id: data.relations.manufacturer.id,
          name: data.relations.manufacturer.name.en
        },
        vehicle_type_id: {
          id: data.relations.vehicleType.id,
          name: data.relations.vehicleType.name.en
        },
      };
    }
  );

  const onSubmitAction = (val: any) => {
    if (val.manufacturer_id) {
      val.manufacturer_id = val.manufacturer_id.id;
    }
    if (val.vehicle_type_id) {
      val.vehicle_type_id = val.vehicle_type_id.id;
    }
    onSubmit(val);
  };

  useEffect(() => {
    if (props.id) {
      filter.expand([
        VEHICLE_RELATIONS.MANUFACTURER,
        VEHICLE_RELATIONS.VEHICLE_TYPE,
        VEHICLE_RELATIONS.PHOTOS_INTERIOR,
        VEHICLE_RELATIONS.PHOTOS_EXTERIOR,
      ]);
      getData(Number(props.id));
    }
  }, [props.id]);

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          modelName="Vehicle"
          urlSlug={ADMIN_PATH.VEHICLES}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: ADMIN_PATH.VEHICLES, text: "Vehicles" },
            { url: false, text: props.id ? "Edit" : "Add" },
          ]}
        />

        <Loader isLoading={loading} />
        <CRUDNotFound loading={loading} data={data} id={props.id} />

        {((props.id && data) || !props.id) && (
          <FormProvider {...formHook}>
            <form onSubmit={handleSubmit(onSubmitAction)} noValidate>
              <Box mb={2}>
                <Card className="relative">
                  <Box p={2}>
                    <Grid container spacing={2} mb={4} maxWidth={800}>
                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="model"
                            label="Model"
                            error={Boolean(errors.model?.message)}
                            helperText={errors.model?.message}
                          />
                        </Box>
                      </Grid>

                      {/* <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="body_type"
                            label="Body Type"
                            error={Boolean(errors.body_type?.message)}
                            helperText={errors.body_type?.message}
                          />
                        </Box>
                      </Grid> */}

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="color"
                            label="Color"
                            error={Boolean(errors.color?.message)}
                            helperText={errors.color?.message}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          {
                            !props.id || data?.id &&
                            <Autocomplete
                              key={`brand-${data?.relations?.manufacturer?.id}`}
                              name={"manufacturer_id"}
                              searchParams={{
                                url: manufacturersUrl,
                                searchBy: ["name"],
                              }}
                              label={"Brand"}
                              labelName={"name"}
                              defaultValue={{
                                name: data?.relations?.manufacturer?.name,
                                id: data?.relations?.manufacturer?.id,
                              }}
                              error={Boolean(errors.manufacturer_id?.message)}
                              helperText={errors.manufacturer_id?.message}
                            />
                          }
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <Autocomplete
                            name={"vehicle_type_id"}
                            searchParams={{
                              url: vehicleTypeUrl,
                              searchBy: ["translations.name"],
                            }}
                            label={"Vehicle Type"}
                            labelName={"name"}
                            defaultValue={
                              data?.relations?.vehicleType
                                ? {
                                    name: data?.relations?.vehicleType?.name
                                      ?.en,
                                    id: data?.relations?.vehicleType?.id,
                                  }
                                : undefined
                            }
                            multilang
                            error={Boolean(errors.vehicle_type_id?.message)}
                            helperText={errors.vehicle_type_id?.message}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="license_plate"
                            label="License plate"
                            error={Boolean(errors.license_plate?.message)}
                            helperText={errors.license_plate?.message}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Box>

              <Box mb={2}>
                <Card className="relative">
                  <Box p={2}>
                    <Grid container spacing={2} mb={4} maxWidth={800}>
                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <Typography variant="h6" component={"div"} mb={1}>
                            Exterior photos
                          </Typography>
                          {data?.relations?.photosExterior?.length ? (
                            <Gallery
                              items={data?.relations?.photosExterior || []}
                            />
                          ) : (
                            <div>-</div>
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} mt={2}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <Typography variant="h6" component={"div"} mb={1}>
                            Interior photos
                          </Typography>

                          {data?.relations?.photosInterior?.length ? (
                            <Gallery
                              items={data?.relations?.photosInterior || []}
                            />
                          ) : (
                            <div>-</div>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Box>

              {errors["non_field_error"] && (
                <div className="error-text">
                  {errors["non_field_error"]?.message}
                </div>
              )}

              <FormButtons cancelUrl={ADMIN_PATH.VEHICLES} />
            </form>
          </FormProvider>
        )}
      </div>
    </>
  );
};

export default VehicleForm;

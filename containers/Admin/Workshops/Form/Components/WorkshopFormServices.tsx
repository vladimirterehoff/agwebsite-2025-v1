// Libs
import React, { Fragment, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { Provider } from "@/app-redux/providers/model";
import { servicesUrl } from "@/app-redux/services/actions";
import { Service } from "@/app-redux/services/model";
import { vehicleTypesActions } from "@/app-redux/vehicleTypes/actions";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Divider, IconButton, Typography } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
// Components
import VehicleTypeItem from "../../../../../components/Common/FormComponents/VehicleTypeItem/VehicleTypeItem";
import Autocomplete from "@/components/Common/FormComponents/Autocomplete";
// Other
import { WorkshopFormValues } from "..";
// Helpers
import { getServicesListForForm, ServiceFormItem } from "../helpers/getServicesListForForm";
// Styles
import styles from "./style.module.scss";


interface Props {
  data: Provider | null;
}

/**
 * Workshop Form Services
 * @param props
 * @constructor
 */
const WorkshopFormServices = (props: Props) => {
  // Store
  const { list: vehicleTypeList } = useSelector(
    (state: AppState) => state.vehicleTypes
  );

  // Hooks
  const { setValue, watch, control } = useFormContext<WorkshopFormValues>();
  const {
    remove: removeService,
    insert: insertService,
  } = useFieldArray({
    control: control,
    name: `services`,
  });
  const [watchServices] = watch(["services"]);

  /**
   * On add new service
   * @param service 
   */
  const onAddNewService = (service: Service | null) => {
    if (service) {
      const newService = getServicesListForForm([service], vehicleTypeList);
      insertService(0, newService[0]);

      setTimeout(() => {
        setValue('service-search', '');
      }, 1)
    }
  };

  const onRemoveService = (index: number) => {
    removeService(index)
  };

  const getVehicleTypes = async () => {
    try {
      await vehicleTypesActions.get(undefined, "limit=300");
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  };

  useEffect(() => {
    getVehicleTypes();
  }, []);

  return (
    <Box mb={2}>
      <Card className="relative">
        <Box p={2}>
          <Grid container spacing={2} rowGap={3} pt={2} mb={4} maxWidth={800}>
            <Grid item xs={12}>
              <Autocomplete
                name={"service-search"}
                searchParams={{
                  url: servicesUrl,
                  searchBy: ["translations.name"],
                  equal: [["user_id", null]],
                  expand: ["vehicleTypes"],
                  exclude: [
                    ['id', watchServices?.map((service: ServiceFormItem) => service?.id) || []],
                    ['availability', ['mobile']
                  ]]
                }}
                label={"Find service"}
                labelName={"name"}
                onChange={onAddNewService}
                multilang
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} mb={-2}>
              <Typography variant="h6" component={"div"}>
                Services
              </Typography>
            </Grid>

            {watchServices?.map((service: ServiceFormItem, index: number) => (
              <Fragment key={service.id}>
                <Grid item xs={12} sm={10}>
                  <Typography variant="body1">{service?.name || 'Undefined'}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={2}
                  display={"flex"}
                  justifyContent={"end"}
                >
                  <IconButton
                    onClick={() => {
                      onRemoveService(index);
                    }}
                  >
                    <DeleteForeverOutlinedIcon  color={'secondary'} />
                  </IconButton>
                </Grid>

                <Grid item xs={12} pt={0}>
                  <section className={styles.vehicleTypeList}>
                    {service.vehicle_types?.map((vehicleType, indexV) => (
                      <VehicleTypeItem
                        index={index}
                        key={vehicleType.id}
                        name={`services[${index}].vehicle_types[${indexV}]`}
                      />
                    ))}
                  </section>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default WorkshopFormServices;

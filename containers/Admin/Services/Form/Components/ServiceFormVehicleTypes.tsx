// Libs
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
// Redux
import { AppState } from "@/app-redux/state";
import { Service } from "@/app-redux/services/model";
import { vehicleTypesActions } from "@/app-redux/vehicleTypes/actions";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Components
import VehicleTypeItem from "@/components/Common/FormComponents/VehicleTypeItem/VehicleTypeItem";
// Styles
import styles from "./style.module.scss";
// Other
import { ServiceFormValues } from "..";

/**
 * Service Form VehicleTypes
 */
const ServiceFormVehicleTypes = () => {
  // Hooks
  const { formState, clearErrors, watch } = useFormContext<ServiceFormValues>();
  const { errors } = formState;
  const [watchVehicleTypes] = watch(["vehicle_types"]);

  /**
   * Get vehicle types
   */
  const getVehicleTypes = async () => {
    try {
      await vehicleTypesActions.get(undefined, "limit=300");
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  };

  /**
   * Handle vehicle type change
   */
  const handleVehicleTypeChange = () => {
    clearErrors('vehicle_types');
  }

  useEffect(() => {
    getVehicleTypes();
  }, []);

  return (
    <Box mb={2}>
      <Card className="relative">
        <Box p={2}>
          <Grid container spacing={2} rowGap={3} pt={2} mb={4} maxWidth={800}>
            <Grid item xs={12} pt={0}>
              <section className={styles.vehicleTypeList}>
                {watchVehicleTypes?.map((vehicleType, index) => (
                                   <VehicleTypeItem
                                   index={index}
                                   key={vehicleType.id}
                                   name={`vehicle_types[${index}]`}
                                 />
                ))}

                {errors["vehicle_types"] && (
                  <div className="error-text">
                    {errors["vehicle_types"]?.message}
                  </div>
                )}
              </section>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default ServiceFormVehicleTypes;

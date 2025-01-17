// Libs
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
// Redux
import { Service } from "@/app-redux/services/model";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
// Components
import Select from "@/components/Common/FormComponents/Select";
import LangTextfield from "@/components/Common/Lang/LangTextfield";
// Other
import { ServiceFormValues, availabilityList } from "..";
import Switch from "@/components/Common/FormComponents/Switch";

interface Props {
  data: Service | null;
}

/**
 * Workshop Form Container
 * @param props
 * @constructor
 */
const WorkshopFormGeneral = (props: Props) => {
  const { data } = props;
  const { formState } = useFormContext<ServiceFormValues>();
  const { errors } = formState;

  // Calculated values
  const avatar = useMemo(
    () => (data?.relations?.avatar ? [data?.relations.avatar] : undefined),
    [data]
  );

  return (
    <Box mb={2}>
      <Card className="relative">
        <Box p={2}>
          <Grid container spacing={2} rowGap={3} mb={4} maxWidth={800} pt={2}>
            <Grid item xs={12}>
              <LangTextfield name="name" label={"Name"} errors={errors?.name} langRequired={['en']} />
            </Grid>

            <Grid item xs={12}>
              <LangTextfield
                name="description"
                multiline
                minRows={3}
                label={"Description"}
                errors={errors?.description}
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                name={"availability"}
                label={"Availability"}
                variants={availabilityList}
                error={Boolean(errors.availability?.message)}
                helperText={errors.availability?.message}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Switch name="is_active" label="Is active"
                              error={Boolean(errors.is_active?.message)}
                              helperText={errors.is_active?.message} />
            </Grid>

          </Grid>
        </Box>
      </Card>

      {errors["non_field_error"] && (
        <Box className="error-text" mb={2}>
          {errors["non_field_error"]?.message}
        </Box>
      )}
    </Box>
  );
};

export default WorkshopFormGeneral;

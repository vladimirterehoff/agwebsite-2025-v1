// Libs
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
// Redux
import { Provider } from "@/app-redux/providers/model";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Divider, Typography } from "@mui/material";
// Components
import FileUploader, {
  MEDIA_TYPE,
} from "@/components/Common/FormComponents/FileUploader";
import LangTextfield from "@/components/Common/Lang/LangTextfield";
import GoogleMapAutocomplete from "@/components/Common/FormComponents/GoogleMapAutocomplete";
import Select from "@/components/Common/FormComponents/Select";
// Other
import { WorkshopFormValues, statusList } from "..";
import Switch from "@/components/Common/FormComponents/Switch";
import ReactHookTextField from "@/components/Common/FormComponents/TextField";

interface Props {
  data: Provider | null;
}

/**
 * Workshop Form General
 * @param props
 * @constructor
 */
const WorkshopFormGeneral = (props: Props) => {
  const { data } = props;
  const { formState } = useFormContext<WorkshopFormValues>();
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
              <LangTextfield name="name" label={"Name"} errors={errors?.name} />
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
                name={"status"}
                label={"Status"}
                variants={statusList}
                error={Boolean(errors.status?.message)}
                helperText={errors.status?.message}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <ReactHookTextField
                name="bank_details"
                label={"Bank details"}
                error={Boolean(errors.bank_details?.message)}
                helperText={errors.bank_details?.message}
                multiline
                minRows={2}
              />
            </Grid>

            <Grid item xs={12}>
              <Switch
                name="is_active"
                label="Is active"
                error={Boolean(errors.is_active?.message)}
                helperText={errors.is_active?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <GoogleMapAutocomplete
                name="address"
                label="Address *"
                mapName="coordinates"
                zoom={8}
                mapContainerStyle={{
                  width: '100%',
                  height: '300px',
                  overflow: 'hidden',
                  border: '1px solid #fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                error={Boolean(errors.address?.message)}
                helperText={errors.address?.message}
                mapError={Boolean(errors.coordinates?.message)}
                mapHelperText={errors.coordinates?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" component={"div"} mb={2}>
                Avatar:
              </Typography>

              <FileUploader
                name={"avatar_id"}
                media={avatar}
                needRemove
                maxCount={1}
                type={MEDIA_TYPE.IMAGE}
                error={errors.avatar_id?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
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

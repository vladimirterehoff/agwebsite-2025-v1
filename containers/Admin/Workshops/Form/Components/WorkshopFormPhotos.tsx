// Libs
import React from "react";
import { useFormContext } from "react-hook-form";
// Redux
import { Provider } from "@/app-redux/providers/model";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
// Components
import FileUploader, {
  MEDIA_TYPE,
} from "@/components/Common/FormComponents/FileUploader";
// Other
import { WorkshopFormValues } from "..";

interface Props {
  data: Provider | null;
}

/**
 * Workshop Form Photos
 * @param props
 * @constructor
 */
const WorkshopFormPhotos = (props: Props) => {
  const { data } = props;
  const { formState } = useFormContext<WorkshopFormValues>();
  const { errors } = formState;

  return (
    <Box mb={2}>
      <Card className="relative">
        <Box p={2}>
          <Grid container spacing={2} rowGap={3} mb={4} maxWidth={800} pt={2}>
            <Grid item xs={12}>
              <Typography variant="h6" component={"div"}>
                Photos
              </Typography>
              <FileUploader
                name={"photos"}
                media={data?.relations?.photos || []}
                needRemove
                type={MEDIA_TYPE.IMAGE}
                maxCount={10}
                multiple
                error={errors.photos?.message}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default WorkshopFormPhotos;

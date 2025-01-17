// Libs
import React, { useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// Redux
import { Provider } from "@/app-redux/providers/model";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Divider, IconButton, Typography } from "@mui/material";
// Components
import SelectMulti from "@/components/Common/FormComponents/SelectMulti";
import TimePicker from "@/components/Common/FormComponents/TimePicker";
import DatePicker from "@/components/Common/FormComponents/DatePicker";
// Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
// Other
import { WorkshopFormValues } from "..";
interface Props {
  data: Provider | null;
}

const DAYS_OF_WEEK = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

/**
 * Workshop Form Schedule
 * @param props
 * @constructor
 */
const WorkshopFormSchedule = (props: Props) => {
  const { data } = props;
  const { handleSubmit, formState, getValues, watch, setValue, control } =
    useFormContext<WorkshopFormValues>();
  const { errors } = formState;

  const {
    fields: extraDayOffsFields,
    append: appendExtraDayOff,
    remove: removeExtraDayOff,
  } = useFieldArray({
    control: control,
    name: "schedule.extra_day_offs",
  });

  // Calculated values
  const schedule = useMemo(
    () => data?.relations?.schedule,
    [data?.relations?.schedule]
  );

  return (
    <Box mb={2}>
      <Card className="relative">
        <Box p={2}>
          <Grid container spacing={2} rowGap={3} pt={2} mb={4} maxWidth={800}>
            <Grid item xs={12} sm={6}>
              <TimePicker
                name="schedule.start_time"
                label="Start time"
                error={Boolean(errors?.["schedule"]?.start_time?.message)}
                helperText={errors?.["schedule"]?.start_time?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                name="schedule.end_time"
                label="End time"
                error={Boolean(errors?.["schedule"]?.end_time?.message)}
                helperText={errors?.["schedule"]?.end_time?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                name="schedule.lunch_start_time"
                label="Lunch start time"
                error={Boolean(errors?.["schedule"]?.lunch_start_time?.message)}
                helperText={errors?.["schedule"]?.lunch_start_time?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                name="schedule.lunch_end_time"
                label="Lunch end time"
                error={Boolean(errors?.["schedule"]?.lunch_end_time?.message)}
                helperText={errors?.["schedule"]?.lunch_end_time?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <SelectMulti
                variants={DAYS_OF_WEEK}
                name={"schedule.day_offs"}
                label={"Days off"}
                error={Boolean(errors?.["schedule"]?.day_offs?.message)}
                helperText={errors?.["schedule"]?.day_offs?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" component={"div"} mb={2}>
                Extra days off:
              </Typography>

              {(extraDayOffsFields as any)?.map((i: any, index: number) => (
                <Box mb={2} display={"flex"}>
                  <DatePicker
                    key={`${index}${i?.id}`}
                    name={`schedule.extra_day_offs[${index}]`}
                    label={"Date"}
                    error={Boolean(
                      errors?.[`schedule`]?.extra_day_offs?.[index]?.message
                    )}
                    helperText={
                      errors?.[`schedule`]?.extra_day_offs?.[index]?.message
                    }
                    disablePast
                  />
                  <Box display={"flex"} alignItems={"center"}>
                    <IconButton
                      onClick={() => {
                        removeExtraDayOff(index);
                      }}
                      style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      <DeleteForeverOutlinedIcon color={'secondary'} />
                    </IconButton>
                  </Box>
                </Box>
              ))}

              <Box mt={1} mb={1} display={"flex"} alignItems={"center"}>
                <IconButton
                  onClick={() => {
                    appendExtraDayOff("");
                  }}
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default WorkshopFormSchedule;

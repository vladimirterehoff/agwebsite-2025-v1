// Libs
import React, { useEffect, useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
// MUI Component
import { Checkbox, Grid, Typography } from "@mui/material";
// Components
import ReactHookTextField from "@/components/Common/FormComponents/TextField";
// Helpers
import { getNestedValue } from "../../../../containers/Admin/Workshops/Form/helpers/getNestedValue";

type Props = {
  name: string;
  index: number;
};

const VehicleTypeItem = ({ name, index }: Props) => {
  const { control, setValue, resetField, watch, formState, clearErrors } =
    useFormContext();
  const { errors } = formState;

  const priceRef = useRef<HTMLInputElement | null>(null);
  const timeRef = useRef<HTMLInputElement | null>(null);

  const errorTime = useMemo(
    () => getNestedValue(errors, `${name}.time`),
    [errors]
  );
  const errorPrice = useMemo(
    () => getNestedValue(errors, `${name}.price`),
    [errors]
  );

  // Scroll to error field
  useEffect(() => {
    if (errorPrice && priceRef.current) {
      priceRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (errorTime && timeRef.current) {
      timeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorPrice, errorTime]);

  const [watchIsChecked] = [watch(`${name}.isChecked`)];

  return (
    <Grid container spacing={2} alignItems={"flex-start"}>
      <Grid item xs>
        <Grid container direction="column">
          <Grid item mb={1} display={"flex"} flexDirection={"row"}>
            <Controller
              name={`${name}.isChecked`}
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <Checkbox
                      style={{ paddingTop: 0, paddingLeft: 0 }}
                      checked={Boolean(field.value)}
                      onChange={(e) => {
                        setValue(`${name}.isChecked`, e.target.checked);
                      }}
                    />
                  </>
                );
              }}
            />
            <Typography variant="body1">
              <Controller
                name={`${name}.name`}
                control={control}
                render={({ field }) => <>{field.value}</>}
              />
            </Typography>
          </Grid>

          <Grid item container spacing={2}>
            <Grid item xs={6}>
              <ReactHookTextField
                name={`${name}.price`}
                type="number"
                label="Price"
                ref={priceRef}
                onChange={() => {
                  clearErrors(`${name}.price`.split("."));
                }}
                inputProps={{ min: 0 }}
                disabled={!watchIsChecked}
                fullWidth
                size="small"
                error={Boolean(errorPrice)}
                helperText={errorPrice ? "Price is required field" : ""}
              />
            </Grid>

            <Grid item xs={6}>
              <ReactHookTextField
                name={`${name}.time`}
                type="number"
                label="Time (min)"
                ref={timeRef}
                onChange={() => {
                  clearErrors(`${name}.time`.split("."));
                }}
                inputProps={{ min: 0 }}
                disabled={!watchIsChecked}
                fullWidth
                size="small"
                error={Boolean(errorTime)}
                helperText={errorTime ? "Time is required field" : ""}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VehicleTypeItem;

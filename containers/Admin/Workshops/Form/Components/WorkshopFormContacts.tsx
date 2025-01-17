// Libs
import React, { Fragment, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// Redux
import { Provider } from "@/app-redux/providers/model";
import { vehicleTypesActions } from "@/app-redux/vehicleTypes/actions";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { IconButton } from "@mui/material";
import PlusCircleIcon from "@mui/icons-material/AddCircleOutline";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
// Components
import ReactHookTextField from "@/components/Common/FormComponents/TextField";
// Other
import { WorkshopFormValues } from "..";

type Contact = {
  name: string;
  phone: string;
  email: string;
  relationship: string;
};

interface Props {
  data: Provider | null;
}

/**
 * Workshop Form Contacts
 * @param props
 * @constructor
 */
const WorkshopFormContacts = (props: Props) => {
  // Hooks
  const { watch, control, formState } =
    useFormContext<WorkshopFormValues>();
  const { errors } = formState;
  const { remove: removeContact, insert: insertContact, fields } = useFieldArray({
    control: control,
    name: `contacts`,
  });
  // const [watchContacts] = watch(["contacts"]);

  /**
   * On add new service
   * @param service
   */
  const onAddNewContact = () => {
    // if (contact) {
    insertContact(fields.length, {
      name: "",
      phone: "",
      email: "",
      relationship: "",
    });
    // }
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
          <Grid container spacing={2} rowGap={3} pt={2} mb={4} maxWidth={1200}>
            {fields?.map((item: Contact, index: number) => (
              <Fragment key={`${item.name}${index}`}>
                <Grid item xs={12} sm={3}>
                  <ReactHookTextField
                    name={`contacts[${index}].name`}
                    label="Contact name"
                    error={Boolean(errors?.contacts?.[index]?.name?.message)}
                    helperText={errors?.contacts?.[index]?.name?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={2.5}>
                  <ReactHookTextField
                    name={`contacts[${index}].phone`}
                    label="Phone number"
                    type="tel"
                    error={Boolean(errors?.contacts?.[index]?.phone?.message)}
                    helperText={errors?.contacts?.[index]?.phone?.message}
                  />
                </Grid>


                <Grid item xs={12} sm={3}>
                  <ReactHookTextField
                    name={`contacts[${index}].email`}
                    label="Email"
                    type="email"
                    error={Boolean(errors?.contacts?.[index]?.email?.message)}
                    helperText={errors?.contacts?.[index]?.email?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <ReactHookTextField
                    name={`contacts.[${index}].relationship`}
                    label="Role"
                    error={Boolean(
                      errors?.contacts?.[index]?.relationship?.message
                    )}
                    helperText={
                      errors?.contacts?.[index]?.relationship?.message
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={0.5}
                  display={"flex"}
                  justifyContent={{ xs: "flex-end", sm: "flex-start" }}
                >
                  <IconButton
                    style={{ margin: "0 auto" }}
                    onClick={() => {
                      removeContact(index);
                    }}
                  >
                    <DeleteForeverOutlinedIcon color={'secondary'} />
                  </IconButton>
                </Grid>
              </Fragment>
            ))}
            <Grid item xs={12} textAlign={"center"}>
              <IconButton onClick={onAddNewContact}>
                <PlusCircleIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default WorkshopFormContacts;

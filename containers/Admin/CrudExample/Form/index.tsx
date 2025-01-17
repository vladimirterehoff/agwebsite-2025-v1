// Libs
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
// Redux
import { AppState } from '@/app-redux/state';
import { crudExampleActions } from "@/app-redux/crudExample/actions";
// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
// Components
import Button from '@/components/Common/Button';
import Loader from '@/components/Common/Loader';
import TextField from '@/components/Common/FormComponents/TextField';
import ContentHeader from '@/components/Admin/ContentHeader';
import CRUDNotFound from '@/components/Admin/Crud/NotFound';
// Hooks
import { useCrudForm } from '@/hooks/crud/useCrudForm';
// Constants
import { ADMIN_PATH } from '@/utils/routers/admin';

interface Props{
  id?: number
}

interface FormValues {
  id: number;
  name: string;
  non_field_error: string;
}

/**
 * Crud Example Form Container
 * @param props
 * @constructor
 */
const Form = (props: Props) => {
  const formHook = useForm<FormValues>({});
  const { handleSubmit, formState } = formHook;
  const { errors } = formState;
  const { loading, data } = useSelector((state: AppState) => state.crudExample);
  const { getData, onSubmit } = useCrudForm<FormValues>(crudExampleActions, formHook, ADMIN_PATH.CRUD);

  useEffect(() => {
    getData(props.id)
  }, [props.id]);

  return (
    <>
      <ContentHeader id={props.id}
                     needBackLink={true}
                     modelName="Crud Example"
                     urlSlug={ADMIN_PATH.CRUD}
                     breadcrumbs={[
                       { url: '/admin', text: 'Dashboard' },
                       {url: ADMIN_PATH.CRUD, text: 'Crud Example'},
                       {url: false, text: props.id? 'Edit' : 'Add'}]}/>

      <Card  className="relative">
        <Box p={2} style={{maxWidth: '600px'}}>
          <Loader isLoading={loading} />
          <CRUDNotFound loading={loading} data={data} id={props.id} />

          <FormProvider {...formHook}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(errors.name?.message)}
                    helperText={errors.name?.message}
                    name="name"
                    label="Name"
                  />
                </Grid>

                <Grid item  xs={12}>
                  <Button type="submit"
                          fullWidth={false}
                          disabled={formState.isSubmitting}>
                    Submit
                  </Button>
                </Grid>

                {errors['non_field_error'] && (
                  <div className="error-text">{errors['non_field_error']?.message}</div>
                )}

              </Grid>
            </form>
          </FormProvider>

        </Box>
      </Card>
    </>
  );
};

export default Form;

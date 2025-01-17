import React, {useEffect} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {AppState} from '@/app-redux/state';
import {useCrudForm} from "@/hooks/crud/useCrudForm";
import Grid from '@mui/material/Grid';
import Button from '@/components/Common/Button';
import Loader from '@/components/Common/Loader';
import ContentHeader from '@/components/Admin/ContentHeader';
import CRUDNotFound from '@/components/Admin/Crud/NotFound';
import {ADMIN_PATH} from '@/utils/routers/admin';
import {settingsActions} from "app-redux/settings";
import {Box} from "@mui/material";
import Card from "@mui/material/Card";
import ReactHookTextField from "@/components/Common/FormComponents/TextField";

interface Props {
  id?: number | string
}

interface FormValues {
  id: number;
  value: string;
  non_field_error: string;
}


const Form = (props: Props) => {
  const formHook = useForm<FormValues>({});
  const {handleSubmit, register, formState, setError} = formHook;
  const {errors} = formState;
  const {loading, data} = useSelector((state: AppState) => state.settings);
  const {getData, onSubmit} = useCrudForm<FormValues>(settingsActions, formHook, ADMIN_PATH.SETTINGS);

  useEffect(() => {
    if (props.id) {
      getData(Number(props.id));
    }
  }, [props.id]);

  return (
    <>
      <ContentHeader id={props.id}
                     needBackLink={true}
                     modelName="Setting"
                     urlSlug={ADMIN_PATH.SETTINGS}
                     breadcrumbs={[
                       {url: '/admin', text: 'Dashboard'},
                       {url: ADMIN_PATH.SETTINGS, text: 'Settings'},
                       {url: false, text: props.id ? 'Edit' : 'Add'}]}/>

      <Loader isLoading={loading}/>
      <CRUDNotFound loading={loading} data={data} id={props.id}/>
      <Card className="relative">
        <Box p={2}>
        {((props.id && data) || !props.id) && (
          <FormProvider {...formHook}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="admin-form">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <ReactHookTextField
                      name="value"
                      label={data?.description}
                      error={Boolean(errors.value?.message)}
                      helperText={errors.value?.message}
                    />
                  </Grid>

                </Grid>
              </div>

              <Box mt={4}>
                {errors['non_field_error'] && (
                  <div className="error-text text-center">{errors['non_field_error']?.message}</div>
                )}
                <Button type="submit" color={'primary'} disabled={formState.isSubmitting}>
                  Submit
                </Button>
              </Box>
            </form>
          </FormProvider>
        )}
        </Box>
      </Card>
    </>
  );
};

export default Form;

// Libs
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
// Redux
import { AppState } from '@/app-redux/state';
import { staticPagesActions } from '@/app-redux/staticPages/actions';
import { MultiLangString } from '@/app-redux/COMMON/model/multilang';
// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
// Components
import Button from '@/components/Common/Button';
import Loader from '@/components/Common/Loader';
import ContentHeader from '@/components/Admin/ContentHeader';
import CRUDNotFound from '@/components/Admin/Crud/NotFound';
import LangEditor from '@/components/Common/Lang/LangEditor';
import LangTextfield from '@/components/Common/Lang/LangTextfield';
// Hooks
import { useCrudForm } from '@/hooks/crud/useCrudForm';
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from '@/utils/routers/admin';
import FormButtons from '@/components/Common/FormComponents/FormButtons';



interface Props {
  id?: string
}

interface FormValues {
  id: number;
  non_field_error: string;
  name: MultiLangString;
  description: MultiLangString;
}

/**
 * Static Pages Form Container
 * @param props
 * @constructor
 */
const StaticPagesForm = (props: Props) => {
  const formHook = useForm<FormValues>({});
  const { handleSubmit, formState } = formHook;
  const { errors } = formState;
  const { loading, data } = useSelector((state: AppState) => state.staticPages);
  const { getData, onSubmit } = useCrudForm<FormValues>(staticPagesActions, formHook, ADMIN_PATH.STATIC_PAGES);

  useEffect(() => {
    if(props.id){
      getData(Number(props.id));
    }
  }, [props.id]);

  useEffect(() => {
    return () => {
      staticPagesActions.clearData();
    }
  }, []);

  return (
    <>
      <div>
          <ContentHeader id={props.id}
                         needBackLink={true}
                         modelName="Static Page"
                         urlSlug={ADMIN_PATH.STATIC_PAGES}
                         breadcrumbs={[
                           { url: ADMIN_MAIN, text: 'Dashboard' },
                           {url: ADMIN_PATH.STATIC_PAGES, text: 'Static Pages'},
                           {url: false, text: props.id? 'Edit' : 'Add'}]}/>
                           
          <Card className="relative">
            <Box p={2}>
              <Loader isLoading={loading} />
              <CRUDNotFound loading={loading} data={data} id={props.id} />

              {((props.id && data) || !props.id) &&  (
                  <FormProvider {...formHook}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                      <Grid container spacing={2} mb={4}>

                        <Grid item xs={12} >
                          <Box maxWidth={'600px'} marginRight={'auto'} mb={4} mt={2}>
                            <LangTextfield name='name'
                                    //  disabled={true}
                                     label={'Name'}
                                     disabled
                                     errors={errors?.name}
                                     />
                          </Box>
                        </Grid>

                        <Grid item xs={12} >
                          <Box maxWidth={'900px'} marginRight={'auto'}>
                            <LangEditor name='description'
                                  errors={errors?.description}
                                  // helperText={errors.body?.message}
                                  />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <FormButtons cancelUrl={ADMIN_PATH.STATIC_PAGES} />

                          {/* <Button type="submit"
                                  fullWidth={false}
                                  disabled={formState.isSubmitting}>
                            Submit
                          </Button> */}
                        </Grid>

                        {errors['non_field_error'] && (
                          <div className="error-text">{errors['non_field_error']?.message}</div>
                        )}

                      </Grid>
                    </form>
                  </FormProvider>
              )}
            </Box>
          </Card>
      </div>
    </>
  );
};

export default StaticPagesForm;

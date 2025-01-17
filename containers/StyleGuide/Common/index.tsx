// Libs
import React, {ReactNode, useEffect, useState} from 'react';
import {useForm, FormProvider} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
// MUI Components
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
// Components
import TextField from '@/components/Common/FormComponents/TextField';
import Editor from '@/components/Common/FormComponents/Editor';
import Checkbox from '@/components/Common/FormComponents/Checkbox';
import Radiobutton from '@/components/Common/FormComponents/Radio';
import Switch from '@/components/Common/FormComponents/Switch';
import DatePicker from '@/components/Common/FormComponents/DatePicker';
import TimePicker from '@/components/Common/FormComponents/TimePicker';
import DateTimePicker from '@/components/Common/FormComponents/DateTimePicker';
import Select from '@/components/Common/FormComponents/Select';
import FileUploader, {MEDIA_TYPE} from '@/components/Common/FormComponents/FileUploader';
import Button from "@/components/Common/Button";
import GoogleAutocomplete from "@/components/Common/FormComponents/GoogleAutocomplete";
import Autocomplete from "@/components/Common/FormComponents/Autocomplete";
import AutocompleteMulti from "@/components/Common/FormComponents/AutocompleteMulti";
import PhoneNumber from "@/components/Common/FormComponents/PhoneNumber";
import {schema} from "./schema";
// Hooks
import { useConfirm } from '@/hooks/dialog/useConfirm';
import { useAlert } from '@/hooks/dialog/useAlert';
//Constants
import {API_URL} from '@/utils/envirenment'
//Styles
import styles from "./style.module.scss";


interface FormValues {
  name1: string;
  name2: string;
  email: string;
  phone: string;
  password: string;
  description: string;
  description1: string;
  editor: string;
  checkbox: string;
  switch: string;
  radio: string;
  check_label: any;
  date_time: string;
  date: string;
  time: string;
  select: number|string;
  media_file: any;
  media_video: any;
  media_image: any;
  select_multiple: any;
  autocomplete: any;
  autocomplete_multi: any;
  address: any;

  non_field_error: string;
}

/**
 * Styleguide Container for the common components
 * @constructor
 */
const CommonGuide = () => {
  const formHook = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const { handleSubmit, formState, reset } = formHook;
  const { errors} = formState;

  const onSubmit = (data:FormValues) => {
    console.log(data);
  }

  const data : any = {
      name1: '111',
      name2: '111',
      email: '111@qwe.com',
      phone: '1111111111',
      password: '111',
      description: '111',
      description1: '111',
      editor: '111',
      checkbox: true,
      switch: true,
      radio: 'radio1',
      date_time: new Date().toString(),
      date: new Date().toString(),
      time: new Date().toString(),
      select: {name:'item 1', id:1},
      select_multiple: [{name:'item 1', id:1}],
      autocomplete: {title:'item 1', id:1},
      autocomplete_multi: [{title:'item 1', id:1}],
      address: 'London'
  }

  const setFormData = () => {
      reset(data);
  };

  /**
   * Standard Alert Modal
   */
  const [alertModal, openAlertModal] = useAlert(
      'Standard Alert',
      'Some message'
  );

  /**
   * Standard Confirm Modal
   */
  const [confirmModal, openConfirmModal] = useConfirm(
        'Standard Confirm',
        'Some message',
        ()=>{console.log('Confirm Action')});

  return (
    <div className={styles.container}>
      <div  className={styles.container_title}>
          Form Control Components
          <Button onClick={setFormData}>Set Form Data</Button>
      </div>

      <FormProvider {...formHook}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          <Grid  container
                 spacing={3}>

            <Grid item xs={12}>
              <div className={styles.title}>Text Field</div>
            </Grid>

            <Grid item md={4}>
              <div className={'m-b-15'}>
                <TextField
                  error={Boolean(errors.name1?.message)}
                  helperText={errors.name1?.message}
                  name="name1"
                  label="Default text field"
                />
              </div>
            </Grid>

            <Grid item md={4}>
              <div className={'m-b-15'}>
                <TextField
                  error={Boolean(errors.name2?.message)}
                  helperText={errors.name2?.message}
                  name="name2"
                  label="Text field (standard style)"
                  variant={'standard'}
                  InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                              <AccountCircle />
                          </InputAdornment>
                      ),
                  }}
                />
              </div>
            </Grid>

            <Grid item md={4}>
              <div className={'m-b-15'}>
                <TextField
                  error={Boolean(errors.email?.message)}
                  helperText={errors.email?.message}
                  name="email"
                  label="Text field - email (filled style)"
                  type="email"
                  variant={'filled'}
                />
              </div>
            </Grid>

            <Grid item md={4}>
              <div className={'m-b-15'}>
                <TextField
                  error={Boolean(errors.password?.message)}
                  helperText={errors.password?.message}
                  type="password"
                  name="password"
                  label="Password"
                />
              </div>
            </Grid>

            <Grid item md={4}>
              <div className={'m-b-15'}>
                <PhoneNumber
                  error={Boolean(errors.phone?.message)}
                  helperText={errors.phone?.message}
                  name="phone"
                  label="Phone"
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className={styles.title}>Textarea Field</div>
            </Grid>

            <Grid item md={6}>
              <div className={'m-b-15'}>
                <TextField
                    error={Boolean(errors.description?.message)}
                    helperText={errors.description?.message}
                    name="description"
                    label="Default textarea"
                    type="text"
                    multiline={true}
                    rows={4}
                />
              </div>

              <div className={'m-b-15'}>
                <TextField
                    error={Boolean(errors.description1?.message)}
                    helperText={errors.description1?.message}
                    name="description1"
                    label="Auto height textarea"
                    type="text"
                    multiline={true}
                />
              </div>
            </Grid>

            <Grid item md={6}>
              <div className={'m-b-15'}>
                <Editor name={'editor'}
                        error={Boolean(errors.editor?.message)}
                        helperText={errors.editor?.message}/>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className={styles.title}>Radio and Checkboxes</div>
            </Grid>

            <Grid item md={4}>
              <Checkbox name={'checkbox'}
                        label={'Checkbox'}
                        error={Boolean(errors.checkbox?.message)}
                        helperText={errors.checkbox?.message}
              />
            </Grid>
            <Grid item md={4}>
              <Radiobutton  name={'radio'}
                            variants={[
                              {name: 'Radio1', value:'radio1'},
                              {name: 'Radio2', value:'radio2'}
                            ]}
                            error={Boolean(errors.radio?.message)}
                            helperText={errors.radio?.message}/>

            </Grid>
            <Grid item md={4}>
              <Switch  name={'switch'}
                       label={"Switch"}
                       error={Boolean(errors.switch?.message)}
                       helperText={errors.switch?.message}/>

            </Grid>

            <Grid item xs={12}>
              <div className={styles.title}>Date Pickers</div>
            </Grid>

            <Grid item md={4}>
              <DatePicker name={'date'}
                          label={'Date'}
                          error={Boolean(errors.date?.message)}
                          helperText={errors.date?.message}/>
            </Grid>

            <Grid item md={4}>
              <TimePicker
                  name={'time'}
                  label={'Time'}
                  error={Boolean(errors.time?.message)}
                  helperText={errors.time?.message}/>
            </Grid>

            <Grid item md={4}>
              <DateTimePicker
                  name={'date_time'}
                  label={'Date and Time'}
                  error={Boolean(errors.date_time?.message)}
                  helperText={errors.date_time?.message}/>
            </Grid>

            <Grid item xs={12}>
              <div className={styles.title}>Select</div>
            </Grid>

            <Grid item md={6}>
              <Select name={'select'}
                      label={'Select'}
                      variants={[
                        {name:'item 1', id:1},
                        {name:'item 2', id:2},
                      ]}
                      error={Boolean(errors.select?.message)}
                      helperText={errors.select?.message}/>
            </Grid>

           <Grid item md={6}>
              <Select name={'select_multiple'}
                      label={'Select Multiple'}
                      multiple={true}
                      variants={[
                        {name:'item 1', id:1},
                        {name:'item 2', id:2},
                        {name:'item 3', id:3},
                        {name:'item 4', id:4},
                      ]}
                      error={Boolean(errors.select_multiple?.message)}
                      helperText={errors.select_multiple?.message}/>
            </Grid>

            <Grid item xs={12}>
              <div className={styles.title}>Autocomplete</div>
            </Grid>

            <Grid item md={4}>
              <Autocomplete name={'autocomplete'}
                            searchParams={{
                                url: `${API_URL}/feed/landing`,
                                searchBy: ['title']
                            }}
                            label={'Autocomplete'}
                            labelName={'title'}
                            error={Boolean(errors.autocomplete?.message)}
                            helperText={errors.autocomplete?.message}/>
            </Grid>

              <Grid item md={4}>
                  <AutocompleteMulti name={'autocomplete_multi'}
                                searchParams={{
                                    url:`${API_URL}/feed/landing`,
                                    searchBy: ['title']
                                }}
                                label={'Multi Autocomplete'}
                                labelName={'title'}
                                error={Boolean(errors.autocomplete_multi?.message)}
                                helperText={errors.autocomplete_multi?.message}/>
              </Grid>

            <Grid item md={4}>
              <GoogleAutocomplete label={'Google Autocomlete'}
                                  name={'address'}
                                  error={Boolean(errors.address?.message)}
                                  helperText={errors.address?.message} />
            </Grid>

            <Grid item xs={12}>
              <div className={styles.title}>File Uploader</div>
            </Grid>

            <Grid item md={4}>
              <FileUploader name={'media_file'}
                            needRemove={true}
                            type={MEDIA_TYPE.FILE}
                            error={errors.media_file?.message}
                            multiple={false}
                            maxCount={5} />
            </Grid>

            <Grid item md={4}>
              <FileUploader name={'media_image'}
                            needRemove={true}
                            type={MEDIA_TYPE.IMAGE}
                            error={errors.media_image?.message}
                            multiple={false}
                            maxSize={10}
                            sizeHelperText={'Max size 10MB'}
                            maxCount={5} />
            </Grid>

            <Grid item md={4}>
              <FileUploader name={'media_video'}
                            needRemove={true}
                            type={MEDIA_TYPE.VIDEO}
                            error={errors.media_video?.message}
                            maxDuration={30}
                            durationHelperText={'Max duration 30 sec'}
                            multiple={false} />
            </Grid>

          </Grid>
          <div className={'m-t-20'}>
            <Button type="submit"
                    disabled={formState.isSubmitting} >
              Send
            </Button>
          </div>

            <div  className={`${styles.container_title} m-t-50`}>
                Standard Modals
            </div>

           {/* ALERT MODAL*/}
            <div className={'m-t-20'}>
                <Button disabled={formState.isSubmitting} onClick={openAlertModal}>
                    Show Alert Modal
                </Button>
                {alertModal}
            </div>

            {/* CONFIRM MODAL*/}
            <div className={'m-t-20'}>
                <Button disabled={formState.isSubmitting} onClick={openConfirmModal}>
                    Show Confirm Modal
                </Button>
                {confirmModal}
            </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CommonGuide;

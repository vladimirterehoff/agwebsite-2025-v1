// Libs
import React, { Fragment, useEffect, useMemo } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { usersActions } from "@/app-redux/users/actions";
import { USER_RELATIONS } from "@/app-redux/users/relations";
import { rolesActions } from "@/app-redux/roles/actions";
import { ROLE_SLUGS, Role } from "@/app-redux/roles/model";
// MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Divider, IconButton, InputAdornment, Typography } from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import ReactHookTextField from "@/components/Common/FormComponents/TextField";
import SelectMulti from "@/components/Common/FormComponents/SelectMulti";
import FileUploader, {
  MEDIA_TYPE,
} from "@/components/Common/FormComponents/FileUploader";
import FormButtons from "@/components/Common/FormComponents/FormButtons";
// Hooks
import { useCrudForm } from "@/hooks/crud/useCrudForm";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
// Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { FilterService } from "@/helpers/filterService";
import { Provider } from "@/app-redux/providers/model";
import { BACKEND_URL } from "@/utils/envirenment";
import AutocompleteMulti from "@/components/Common/FormComponents/AutocompleteMulti";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DatePicker from "@/components/Common/FormComponents/DatePicker";
import moment from "moment";
import { BE_DATE_FORMAT } from "@/utils/constants";
import {servicesActions} from "@/app-redux/services/actions";

interface Props {
  id?: string;
}

interface FormValues {
  id: number;
  non_field_error: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_ids: any[];
  birthday: string;
  avatar_id?: number;
  reserve_phone?: string;
  personal_email?: string;
  provider_ids?: number[];

  passport_data?: {
    id: any;
    identification_number: any;
    residential_address: any;
  };
  "passport_data.id": any;
  "passport_data.identification_number": any;
  "passport_data.residential_address": any;

  "schedule.emergency_contacts": string[];

  emergency_contacts?: {
    name: string;
    phone: string;
    relationship: string;
  }[];

  password?: string;
  password_confirmation?: string;

  [key: string]: any;
}

export const roleSignInSlugs = [
  ROLE_SLUGS.SUPER_ADMIN,
  ROLE_SLUGS.USER,
  ROLE_SLUGS.CLEANER,
];
export const roleBackendSignInSlugs = [ROLE_SLUGS.SUPER_ADMIN, ROLE_SLUGS.WORKSHOP_MANAGER, ROLE_SLUGS.DISPATCH_MANAGER];

/**
 * User Form Container
 * @param props
 * @constructor
 */
const UserForm = (props: Props) => {
  const formHook = useForm<FormValues>({});
  const { handleSubmit, formState, getValues, watch, setValue } = formHook;
  const { errors } = formState;
  const {
    fields: emeregancyContFields,
    append: appendEmeregancyCont,
    remove: removeEmeregancyCont,
  } = useFieldArray({
    control: formHook.control,
    name: "emergency_contacts",
  });

  // Store
  const { loading, data } = useSelector((state: AppState) => state.users);
  const { list: roles } = useSelector((state: AppState) => state.roles);

  // Calculated values
  const avatar = useMemo(
    () => (data?.relations?.avatar ? [data?.relations.avatar] : undefined),
    [data]
  );

  /**
   * Use crud form
   */
  const { getData, onSubmit, filter } = useCrudForm<FormValues>(
    usersActions,
    formHook,
    ADMIN_PATH.USERS,
    (data) => {
      const { relations, ...otherData } = data;
      return {
        ...otherData,
        role_ids: relations?.roles?.map((role: any) => role.id),
        birthday: data?.birthday
          ? moment(data?.birthday * 1000)
              .utc()
              .format(BE_DATE_FORMAT)
          : null,
        // roles: data?.relations?.roles?.reduce((acc: number[], role: any) => {
        //   if (role.slug !== ROLE_SLUGS.SIGN_IN || role.slug !== ROLE_SLUGS.BACKEND_SIGN_IN)}, []),
      };
    }
  );

  const [rolesWatch] = [watch("role_ids")];
  const [emergencyConWatch] = [watch("emergency_contacts")];
  const [providersWatch] = [watch("provider_ids")];

  /**
   * Check role
   */
  const isRole = useMemo(() => {
    const rolesArray = [...roles];
    if (rolesArray?.length) {
      const currentRoles = rolesArray?.reduce((acc: string[], role: Role) => {
        if (rolesWatch?.includes(role.id)) return [...acc, role.slug];
        return acc as string[];
      }, []);

      return {
        [ROLE_SLUGS.CLEANER]: currentRoles.includes(ROLE_SLUGS.CLEANER),
        [ROLE_SLUGS.USER]: currentRoles.includes(ROLE_SLUGS.USER),
        [ROLE_SLUGS.WORKSHOP_MANAGER]: currentRoles.includes(
          ROLE_SLUGS.WORKSHOP_MANAGER
        ),
        [ROLE_SLUGS.DISPATCH_MANAGER]: currentRoles.includes(
          ROLE_SLUGS.DISPATCH_MANAGER
        ),
        [ROLE_SLUGS.SUPER_ADMIN]: currentRoles.includes(ROLE_SLUGS.SUPER_ADMIN),
      };
    } else {
      return {
        [ROLE_SLUGS.CLEANER]: false,
        [ROLE_SLUGS.USER]: false,
        [ROLE_SLUGS.WORKSHOP_MANAGER]: false,
        [ROLE_SLUGS.DISPATCH_MANAGER]: false,
        [ROLE_SLUGS.SUPER_ADMIN]: false,
      };
    }
  }, [rolesWatch, roles]);

  /**
   * Submit form
   * @param formData
   */
  const onSubmitAction = (formData: FormValues) => {
    const newFormData: any = { ...formData };

    const rolesArray = [...roles];
    // Roles convert
    // Get sign in ids
    const isSignInIDs = rolesArray.reduce((acc: number[], role) => {
      if (roleSignInSlugs.includes(role.slug)) {
        acc = [...acc, role.id];
        return acc;
      } else return acc;
    }, []);

    // Get backend sign in ids
    const isBackendSignInIDs = rolesArray.reduce((acc: number[], role) => {
      if (roleBackendSignInSlugs.includes(role.slug)) {
        acc = [...acc, role.id];
        return acc;
      } else return acc;
    }, []);

    // Get sign in role
    const roleSignIn = rolesArray.find(
      (role: Role) => role.slug === ROLE_SLUGS.SIGN_IN
    );

    // Get backend sign in role
    const roleBackendSignIn = rolesArray.find(
      (role: Role) => role.slug === ROLE_SLUGS.BACKEND_SIGN_IN
    );

    // Automatically add sign in role
    // try {
    //   if (newFormData.role_ids?.some((id: any) => isSignInIDs.includes(id))) {
    //     newFormData.role_ids = [...newFormData.role_ids, roleSignIn?.id];
    //   }
    //   if (
    //     newFormData.role_ids?.some((id: any) => isBackendSignInIDs.includes(id))
    //   ) {
    //     newFormData.role_ids = [...newFormData.role_ids, roleBackendSignIn?.id];
    //   }
    // } catch {}

    // Provider ids convert
    if (newFormData.provider_ids && newFormData.provider_ids.length) {
      newFormData.provider_ids = newFormData.provider_ids.map(
        (provider: any) => provider.id
      );
    }

    // Birthday convert
    if (newFormData.birthday) {
      newFormData.birthday = moment
        .utc(newFormData.birthday, "YYYY-MM-DD")
        .unix();
    }

    console.log(">> newFormData", newFormData);

    onSubmit(newFormData);
  };

  /**
   * Roles variants
   */
  const rolesVariants = useMemo(() => {
    const rolesArray = [...roles];
    return rolesArray.reduce((acc: any[], role) => {
      // if (HIDE_ROLES.includes(role.slug)) {
      //   return acc;
      // } else {
      return [...acc, { id: role.id, name: role.name }];
      // }
    }, []);
  }, [roles]);

  /**
   * Add emergency contacts
   */
  const addEmergencyContacts = (name: string = '', phone: string = '', relationship: string = '') => {
    appendEmeregancyCont({
      name: name,
      phone: phone,
      relationship: relationship,
    });
  };

  /**
   * Default provider data
   */
  const defaultProviderData = () => {
    return data?.relations?.providers?.map((provider) => {
      return {
        label: provider?.name?.en,
        id: provider?.id,
      };
    });
  };

  /**
   * Get provider filter
   */
  const getProviderFilter = () => {
    const filterService = new FilterService();

    filterService.builder.equal("type", "stationary");

    return filterService;
  };

  /**
   * Lifecycle - Get data
   */
  useEffect(() => {
    if (props.id) {
      filter.expand([
        USER_RELATIONS.ROLES,
        USER_RELATIONS.AVATAR,
        USER_RELATIONS.PROVIDERS,
        "provider.contacts",
        "provider.wallet",
      ]);
      getData(Number(props.id));
    }
  }, [props.id]);

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (!roles?.length) rolesActions.get(undefined, "limit=100");
  }, []);

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (data?.relations?.provider?.relations?.contacts) {
      data?.relations?.provider?.relations?.contacts.map(contact => addEmergencyContacts(
        contact.name,
        contact.phone,
        contact.relationship
      ))
    }
  }, [data]);

  /**
   * Clear data on unmount component
   * */
  useEffect(() => {
    return () => {
      usersActions.clearData();
    };
  }, []);

  useEffect(() => {
    return () => {
      formHook.clearErrors('provider_ids');
    };
  }, [providersWatch]);

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          modelName="Users"
          urlSlug={ADMIN_PATH.USERS}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: ADMIN_PATH.USERS, text: "Users" },
            { url: false, text: props.id ? "Edit" : "Add" },
          ]}
        />

        <Loader isLoading={loading} />
        <CRUDNotFound loading={loading} data={data} id={props.id} />

        {((props.id && data) || !props.id) && (
          <FormProvider {...formHook}>
            <form
              onSubmit={handleSubmit(onSubmitAction)}
              noValidate
              autoComplete="new-password"
            >
              <Box mb={2}>
                <Card className="relative">
                  <Box p={2}>
                    <Grid container spacing={2} mb={4} maxWidth={800}>
                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="first_name"
                            label="First name"
                            error={Boolean(errors.first_name?.message)}
                            helperText={errors.first_name?.message}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="last_name"
                            label="Last name"
                            type="tel"
                            error={Boolean(errors.last_name?.message)}
                            helperText={errors.last_name?.message}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <SelectMulti
                            variants={rolesVariants || []}
                            name={"role_ids"}
                            label={"Roles"}
                            // labelName={'name'}
                            error={Boolean(errors.role_ids?.message)}
                            helperText={errors.role_ids?.message}
                            onChange={(val) => {
                              // console.log(">> val", val);
                            }}
                            onItemSelect={(val, isSelected) => {
                              // TODO: NEED AUTOMATICALLY ADD ROLE FOR SIGN IN (Admin panel or APP)

                              // if (isSelected) {
                              //   const ID = val?.id;
                              //   if (isSignInIDs.includes(ID))
                                
                              //   if (roleBackendSignInSlugs.includes(val.slug)) {
                              //     setValue("role_ids", [...rolesWatch, val.id]);
                              //   }
                              //   console.log(">> val 22", val, isSelected);
                              // }



                              // try {
                              //   if (newFormData.role_ids?.some((id: any) => isSignInIDs.includes(id))) {
                              //     newFormData.role_ids = [...newFormData.role_ids, roleSignIn?.id];
                              //   }
                              //   if (
                              //     newFormData.role_ids?.some((id: any) => isBackendSignInIDs.includes(id))
                              //   ) {
                              //     newFormData.role_ids = [...newFormData.role_ids, roleBackendSignIn?.id];
                              //   }
                              // } catch {}
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="phone"
                            label="Phone number"
                            type="tel"
                            error={Boolean(errors.phone?.message)}
                            helperText={errors.phone?.message}
                          />
                        </Box>
                      </Grid>

                      {isRole[ROLE_SLUGS.CLEANER] ? (
                        <>
                          <Grid item xs={12}>
                            <Box marginRight={"auto"} mt={2}>
                              <ReactHookTextField
                                name="reserve_phone"
                                label="Reserve phone number"
                                type="tel"
                                error={Boolean(errors.reserve_phone?.message)}
                                helperText={errors.reserve_phone?.message}
                              />
                            </Box>
                          </Grid>
                        </>
                      ) : null}

                      {isRole[ROLE_SLUGS.CLEANER] ||
                      isRole[ROLE_SLUGS.WORKSHOP_MANAGER] ||
                      isRole[ROLE_SLUGS.DISPATCH_MANAGER] ? (
                        <>
                          <Grid item xs={12}>
                            <Box marginRight={"auto"} mt={2}>
                              <ReactHookTextField
                                name="email"
                                label="Email"
                                type="email"
                                error={Boolean(errors.email?.message)}
                                helperText={errors.email?.message}
                              />
                            </Box>
                          </Grid>
                        </>
                      ) : null}

                       {isRole[ROLE_SLUGS.USER] ? (
                        <Grid item xs={12}>
                          <Box marginRight={"auto"} mt={2}>
                            <DatePicker
                              name="birthday"
                              label="Birthday"
                              error={Boolean(errors.birthday?.message)}
                              helperText={errors.birthday?.message}
                            />
                          </Box>
                        </Grid>
                       ) : null}

                      {isRole[ROLE_SLUGS.CLEANER] ? (
                        <>
                          <Grid item xs={12}>
                            <Box marginRight={"auto"} mt={2}>
                              <ReactHookTextField
                                name="personal_email"
                                label="Personal email"
                                type="email"
                                error={Boolean(errors.personal_email?.message)}
                                helperText={errors.personal_email?.message}
                              />
                            </Box>
                          </Grid>
                        </>
                      ) : null}

                      {isRole[ROLE_SLUGS.WORKSHOP_MANAGER] ? (
                        <>
                          <Grid item xs={12}>
                            <Box marginRight={"auto"} mt={2}>
                              <AutocompleteMulti
                                name={"provider_ids"}
                                searchParams={{
                                  url: `${BACKEND_URL}/providers`,
                                  searchBy: ["translations.name"],
                                  filterService: getProviderFilter(),
                                  exclude: [
                                    ['id', Array.isArray(providersWatch) 
                                      ? providersWatch.map((item: any) => Number(item.id)) 
                                      : []] as [string, number[]]
                                  ]
                                }}
                                label={"Workshops"}
                                labelName={"label"}
                                getName={(provider: Provider) => provider.name.en}
                                error={Boolean(errors.provider_ids?.message)}
                                helperText={errors.provider_ids?.message}
                                defaultValue={defaultProviderData()}
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                        </>
                      ) : null}

                      {isRole[ROLE_SLUGS.CLEANER] ? (
                        <>
                          <Grid item xs={12}>
                            <Typography variant="h6" component={"div"}>
                              Passport data:
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <Box marginRight={"auto"} mt={2}>
                              <ReactHookTextField
                                name="passport_data.id"
                                label="ID: code and number"
                                required
                                error={Boolean(
                                  errors?.passport_data?.id?.message
                                )}
                                helperText={
                                  errors?.passport_data?.id?.message
                                    ? `${errors?.passport_data?.id?.message}`
                                    : undefined
                                }
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <Box marginRight={"auto"} mt={2}>
                              <ReactHookTextField
                                name="passport_data.identification_number"
                                label="Identification number"
                                required
                                error={Boolean(
                                  errors?.passport_data?.identification_number
                                    ?.message
                                )}
                                helperText={
                                  errors?.passport_data?.identification_number
                                    ?.message
                                    ? `${errors?.passport_data?.identification_number?.message}`
                                    : undefined
                                }
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <Box marginRight={"auto"} mt={2}>
                              <ReactHookTextField
                                name="passport_data.residential_address"
                                label="Residential Address"
                                required
                                error={Boolean(
                                  errors?.passport_data?.residential_address
                                    ?.message
                                )}
                                helperText={
                                  errors?.passport_data?.residential_address
                                    ?.message
                                    ? `${errors?.passport_data?.residential_address?.message}`
                                    : undefined
                                }
                              />
                            </Box>
                          </Grid>

                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                        </>
                      ) : null}

                      {isRole[ROLE_SLUGS.CLEANER] ? (
                        <>
                          <Grid item xs={12}>
                            <Typography variant="h6" component={"div"}>
                              Emergency contacts:
                            </Typography>
                          </Grid>

                          {/* {emeregancyContFields?.length} */}
                          {emeregancyContFields?.map((contact, index) => (
                            <Fragment key={index}>
                              <Grid item xs={12} sm={4}>
                                <Box marginRight={"auto"}>
                                  <ReactHookTextField
                                    name={`emergency_contacts[${index}].name`}
                                    label="Name"
                                    error={Boolean(
                                      errors?.emergency_contacts?.[index]?.name
                                        ?.message
                                    )}
                                    helperText={
                                      errors?.emergency_contacts?.[index]?.name
                                        ?.message
                                    }
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={4}>
                                <Box marginRight={"auto"} mt={0}>
                                  <ReactHookTextField
                                    name={`emergency_contacts[${index}].phone`}
                                    label="Phone"
                                    type="tel"
                                    error={Boolean(
                                      errors?.emergency_contacts?.[index]?.phone
                                        ?.message
                                    )}
                                    helperText={
                                      errors?.emergency_contacts?.[index]?.phone
                                        ?.message
                                    }
                                  />
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={3}>
                                <Box marginRight={"auto"} mt={0}>
                                  <ReactHookTextField
                                    name={`emergency_contacts[${index}].relationship`}
                                    label="Relationship"
                                    error={Boolean(
                                      errors?.emergency_contacts?.[index]
                                        ?.relationship?.message
                                    )}
                                    helperText={
                                      errors?.emergency_contacts?.[index]
                                        ?.relationship?.message
                                    }
                                  />
                                </Box>
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                sm={0.5}
                                display="flex"
                                alignItems="center"
                              >
                                <IconButton
                                  onClick={() => removeEmeregancyCont(index)}
                                  style={{ margin: "0 auto" }}
                                >
                                  <DeleteForeverOutlinedIcon color="secondary" />
                                </IconButton>
                              </Grid>

                              <Grid item xs={12} ml={3} mt={1} mb={1}>
                                <div
                                  style={{
                                    height: 5,
                                    backgroundColor: "#f6f6f6",
                                    width: "100%",
                                  }}
                                />
                              </Grid>
                            </Fragment>
                          ))}

                          <Grid item xs={12}>
                            <Box
                              mt={1}
                              mb={1}
                              display={"flex"}
                              alignItems={"center"}
                            >
                              <IconButton
                                onClick={() => {
                                  addEmergencyContacts();
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
                        </>
                      ) : null}

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" component={"div"}>
                          Avatar:
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <FileUploader
                          name={"avatar_id"}
                          media={avatar}
                          // showPreview
                          // needPrevFullscreen
                          needRemove
                          type={MEDIA_TYPE.IMAGE}
                          maxCount={1}
                          error={Boolean(errors.avatar_id?.message)}
                          helperText={errors.avatar_id?.message}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Divider />
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            error={Boolean(errors?.password?.message)}
                            helperText={errors?.password?.message}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box marginRight={"auto"} mt={2}>
                          <ReactHookTextField
                            name="password_confirmation"
                            label="Password confirmation"
                            type="password"
                            autoComplete="new-password"
                            error={Boolean(
                              errors?.password_confirmation?.message
                            )}
                            helperText={errors?.password_confirmation?.message}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              </Box>

              {errors["non_field_error"] && (
                <div className="error-text">
                  {errors["non_field_error"]?.message}
                </div>
              )}

              <FormButtons cancelUrl={ADMIN_PATH.USERS} />
            </form>
          </FormProvider>
        )}
      </div>
    </>
  );
};

export default UserForm;

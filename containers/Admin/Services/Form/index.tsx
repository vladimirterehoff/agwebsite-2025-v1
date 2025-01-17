// Libs
import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
// Redux
import { AppState } from "@/app-redux/state";;
import { MultiLangString } from "@/app-redux/COMMON/model/multilang";
import { SERVICE_AVAILABILITY, ServiceVehicleType } from "@/app-redux/services/model";
import { servicesActions } from "@/app-redux/services/actions";
import { SERVICE_RELATIONS } from "@/app-redux/services/relations";
// MUI Components
import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
// Components
import ServiceFormGeneral from "./Components/ServiceFormGeneral";
import ServiceFormVehicleTypes from "./Components/ServiceFormVehicleTypes";
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import FormButtons from "@/components/Common/FormComponents/FormButtons";
// Hooks
import { useCrudForm } from "@/hooks/crud/useCrudForm";
// Utils
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
// Helpers
import { FormTab, showTabWithErrors } from "@/helpers/showTabWithErrors";
import { enumToSelectList } from "@/helpers/enumToSelectList";
import { schema } from "./schema";
import { getVehicleTypesForForm } from "./helpers/getVehicleTypesForForm";


interface Props {
  id?: string;
}

export const availabilityList = enumToSelectList(SERVICE_AVAILABILITY);

export interface ServiceFormValues {
  id: number;
  non_field_error: string;
  name: MultiLangString;
  description: MultiLangString;
  avatar_id: string;
  availability: { id: string; name: string };
  is_active: boolean;

  vehicle_types: ServiceVehicleType[];
}

/**
 * Service Form Container
 * @param props
 */
const ServiceForm = (props: Props) => {
  // Store
  const { loading, data } = useSelector((state: AppState) => state.services);
  const { list: vehicleTypes } = useSelector((state: AppState) => state.vehicleTypes);
  // Hooks
  const formHook = useForm<ServiceFormValues>({ resolver: yupResolver(schema) });
  const { handleSubmit, formState, setValue } = formHook;
  const { errors } = formState;

  // Tabs
  const TABS: FormTab[] = useMemo(
    () => [
      {
        name: "General info",
        value: "general",
        content: <ServiceFormGeneral data={data} />,
        errorNames: [
          "name.en",
          "description",
          "avatar_id",
          "availability",
        ],
        notStrictNameMatch: true,
      },
      {
        name: "Vehicle types",
        value: "vehicle_types",
        content: (
          <ServiceFormVehicleTypes />
        ),
        errorNames: ["vehicle_types"],
        notStrictNameMatch: true,
      },
    ],
    [vehicleTypes]
  );

  // Tab state
  const [tab, setTab] = useState(TABS[0].value);

  const tabChange = (_: any, value: string) => {
    setTab(value);
  };

  /**
   * Use crud form
   * */ 
  const { getData, onSubmit, filter } = useCrudForm<ServiceFormValues>(
    servicesActions,
    formHook,
    ADMIN_PATH.SERVICES,
    (data) => {
      const { relations, ...otherData } = data;
      return {
        ...otherData,
        availability: data.availability
          ? availabilityList.find((i) => i.id === data.availability)
          : undefined,
      };
    }
  );

  /**
   * Submit form
   * */ 
  const onSubmitAction = async (formData: ServiceFormValues) => {
    const newFormData: any = { ...formData };

    // Vehicle types
    if (formData.vehicle_types?.length) {
      newFormData.vehicle_types = formData.vehicle_types.filter((type: any) => type.isChecked);
    }

    // Status
    if (formData.availability?.id) {
      newFormData.availability = formData.availability.id;
    }

    try {
      await onSubmit(newFormData);
    } catch (error) {
      showTabWithErrors({ setTab, error, tabs: TABS });
    }
  };

  /**
   * Format errors
   * */ 
  const formatErrors = (errors: any) => {
    return Object.entries(errors).map(([field, error]: [string, any]) => ({
      field,
      errors: [error.message]
    }));
  };

  // Lifecycles

  /**
   * Get vehicle types for form 
   * */ 
  useEffect(() => {
    const resp: any = getVehicleTypesForForm(data, vehicleTypes);
      setValue("vehicle_types", resp);
  }, [data, vehicleTypes]);

  /**
   * Get data of service
   * */ 
  useEffect(() => {
    if (props.id) {
      filter.expand([
        SERVICE_RELATIONS.VEHICEL_TYPES,
        SERVICE_RELATIONS.VEHICEL_TYPES_TRANSLATIONS,
      ]);
      filter.scope({ name: 'withBasicVehicleTypes', parameters: [] })
      getData(Number(props.id));
    }
  }, [props.id]);

  /**
   * Change tab if there are errors (need for frontend validation)
   * */ 
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      showTabWithErrors({ setTab, error: { errors: formatErrors(errors) }, tabs: TABS });
    }
  }, [errors]);

  /**
   * Clear data on unmount component
   * */ 
  useEffect(() => {
    return () => {
      servicesActions.clearData();
    };
  }, []);


  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          modelName="Services"
          urlSlug={ADMIN_PATH.SERVICES}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: ADMIN_PATH.SERVICES, text: "Services" },
            { url: false, text: props.id ? "Edit" : "Add" },
          ]}
        />

        <TabContext value={tab}>
          <TabList onChange={tabChange}>
            {TABS.map((item) => (
              <Tab
                key={`tab-${item.value}`}
                label={item.name}
                value={item.value}
              />
            ))}
          </TabList>
        </TabContext>

        <Loader isLoading={loading} />
        <CRUDNotFound loading={loading} data={data} id={props.id} />

        {((props.id && data) || !props.id) && (
          <FormProvider {...formHook}>
            <form
              onSubmit={handleSubmit(onSubmitAction)}
              noValidate
              autoComplete="new-password"
            >
              {/* FORMS CONTENT */}
              <Box mt={1}>
                {TABS.map((item) => (
                  <div
                    key={`tab-content-${item.value}`}
                    style={{ display: tab !== item.value ? "none" : "block" }}
                  >
                    {item.content}
                  </div>
                ))}
              </Box>

              {errors["non_field_error"] && (
                <div className="error-text">
                  {errors["non_field_error"]?.message}
                </div>
              )}

              <FormButtons cancelUrl={ADMIN_PATH.SERVICES} />
            </form>
          </FormProvider>
        )}
      </div>
    </>
  );
};

export default ServiceForm;

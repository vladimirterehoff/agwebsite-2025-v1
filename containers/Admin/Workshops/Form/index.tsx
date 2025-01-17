// Libs
import React, { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
// Redux
import { AppState } from "@/app-redux/state";
import { PROVIDER_RELATIONS } from "@/app-redux/providers/relations";
import { MultiLangString } from "@/app-redux/COMMON/model/multilang";
import { providersActions } from "@/app-redux/providers/actions";
import { Contact, PROVIDER_STATUS, Schedule } from "@/app-redux/providers/model";
import { servicesActions } from "@/app-redux/services/actions";
// MUI Components
import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
// Components
import WorkshopFormGeneral from "./Components/WorkshopFormGeneral";
import WorkshopFormSchedule from "./Components/WorkshopFormSchedule";
import WorkshopFormServices from "./Components/WorkshopFormServices";
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import FormButtons from "@/components/Common/FormComponents/FormButtons";
import WorkshopFormPhotos from "./Components/WorkshopFormPhotos";
// Hooks
import WorkshopFormContacts from "./Components/WorkshopFormContacts";
import { useCrudForm } from "@/hooks/crud/useCrudForm";
// Utils
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
// Helpers
import { FormTab, showTabWithErrors } from "@/helpers/showTabWithErrors";
import { enumToSelectList } from "@/helpers/enumToSelectList";
import {
  getServicesListForForm,
  ServiceFormItem,
} from "./helpers/getServicesListForForm";
import { notify } from "@/helpers/notify";
// Other
import { schema } from "./schema";

interface Props {
  id?: string;
}

export const statusList = enumToSelectList(PROVIDER_STATUS);

export interface WorkshopFormValues {
  id: number;
  non_field_error: string;
  name: MultiLangString;
  description: MultiLangString;
  avatar_id: string;
  status: { id: string; name: string };
  is_active: boolean;
  bank_details: string;

  schedule: Schedule;

  address: string;
  coordinates: string;

  contacts: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  }[];

  [key: string]: any; // TODO: because array field schedule.extra_day_offs[] & services[]
}

/**
 * Workshop Form Container
 * @param props
 * @constructor
 */
const WorkshopForm = (props: Props) => {
  // Store
  const { loading, data } = useSelector((state: AppState) => state.providers);
  const { list: servicesList } = useSelector(
    (state: AppState) => state.services
  );
  const { list: vehicleTypeList } = useSelector(
    (state: AppState) => state.vehicleTypes
  );

  // Hooks
  const formHook = useForm<WorkshopFormValues>({
    resolver: yupResolver(schema),
  });
  const { handleSubmit, formState, setValue } = formHook;
  const { errors } = formState;

  // Tabs
  const TABS: FormTab[] = useMemo(
    () => [
      {
        name: "General info",
        value: "general",
        content: <WorkshopFormGeneral data={data} />,
        errorNames: [
          "name.en",
          "description",
          "coordinates",
          "address",
          "avatar_id",
        ],
        notStrictNameMatch: true,
      },
      {
        name: "Photos",
        value: "photos",
        content: <WorkshopFormPhotos data={data} />,
        errorNames: ["photos"],
        notStrictNameMatch: true,
      },
      {
        name: "Schedule",
        value: "schedule",
        content: <WorkshopFormSchedule data={data} />,
        errorNames: ["schedule"],
        notStrictNameMatch: true,
      },
      {
        name: "Services",
        value: "services",
        content: <WorkshopFormServices data={data} />,
        errorNames: ["services"],
        notStrictNameMatch: true,
      },
      {
        name: "Contacts",
        value: "contacts",
        content: <WorkshopFormContacts data={data} />,
        errorNames: ["contacts"],
        notStrictNameMatch: true,
      },
    ],
    [data]
  );

  // Tab state
  const [tab, setTab] = useState(TABS[0].value);

  const tabChange = (_: any, value: string) => {
    setTab(value);
  };

  const { getData, onSubmit, filter } = useCrudForm<WorkshopFormValues>(
    providersActions,
    formHook,
    ADMIN_PATH.WORKSHOPS,
    (data) => {
      const { relations, ...otherData } = data;
      return {
        ...otherData,
        schedule: {
          ...relations?.schedule,
        },
        status: data.status
          ? statusList.find((i) => i.id === data.status)
          : undefined,
        contacts: data.relations?.contacts?.map((i: Contact) => ({
          name: i.name ||   "",
          phone: i.phone || "",
          email: i.email || "",
          relationship: i.relationship || "",
        })),
      };
    }
  );

  const onSubmitAction = async (formData: WorkshopFormValues) => {
    const newFormData: any = { ...formData };
    delete newFormData["service-search"];

    // Schedule
    if (newFormData.schedule.extra_day_offs?.length)
      newFormData.schedule.extra_day_offs =
        newFormData.schedule.extra_day_offs.map((i: any) =>
          moment(i).format("YYYY-MM-DD")
        );

    // Services
    if (newFormData.services?.length) {
      newFormData.services = newFormData.services.map(
        (service: ServiceFormItem) => {
          return {
            id: service.id,
            vehicle_types: service.vehicle_types.filter((tv) => tv.isChecked),
          };
        }
      );
    }

    // Status
    if (formData.status?.id) {
      newFormData.status = formData.status.id;
    }

    try {
      await onSubmit(newFormData);
    } catch (error) {
      showTabWithErrors({ setTab, error, tabs: TABS });
    }
  };

  useEffect(() => {
    if (props.id) {
      // Get workshop data
      filter.expand([
        PROVIDER_RELATIONS.AVATAR,
        PROVIDER_RELATIONS.CONTACTS,
        PROVIDER_RELATIONS.SCHEDULES,
        PROVIDER_RELATIONS.SCHEDULE_DAY_OFFS,
        PROVIDER_RELATIONS.SERVICES,
        PROVIDER_RELATIONS.SERVICES_VEHICLE_TYPE,
        PROVIDER_RELATIONS.PHOTOS,
      ]);
      getData(Number(props.id));

      // Get services data
      servicesActions.get(
        undefined,
        `scopes=[{"name":"withWorkshopVehicleTypes","parameters":[${props.id}]}]&expand=vehicleTypes`
      );
    }
  }, [props.id]);

  useEffect(() => {
    const resp = getServicesListForForm(servicesList, vehicleTypeList);
    setValue("services", resp);
  }, [servicesList, vehicleTypeList]);

  useEffect(() => {
    return () => {
      providersActions.clearData();
      servicesActions.clearList();
    };
  }, []);

  useEffect(() => {
    if (errors?.services) {
      setTab("services");
      notify.error("Please fill all required on Services tab.");
    }
  }, [errors]);

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          modelName="Workshops"
          urlSlug={ADMIN_PATH.WORKSHOPS}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: ADMIN_PATH.WORKSHOPS, text: "Workshops" },
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

              <FormButtons cancelUrl={ADMIN_PATH.WORKSHOPS} />
            </form>
          </FormProvider>
        )}
      </div>
    </>
  );
};

export default WorkshopForm;

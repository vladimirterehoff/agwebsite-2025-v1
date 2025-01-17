// Libs
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { providersActions } from "@/app-redux/providers/actions";
import { PROVIDER_RELATIONS } from "@/app-redux/providers/relations";
// MUI Components
import { Accordion, Box, Typography } from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import UniversalViewer from "@/components/Admin/UniversalViewer";
// import GoogleMapView from "@/components/";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import { FilterService } from "@/helpers/filterService";
import GoogleMapView from "@/components/Admin/GoogleMapView";
import Button from "@/components/Common/Button";
import AdminEditButton from "@/components/Admin/Crud/AdminEditButton";
import useCheckRole from "@/hooks/useIsAdmin";
import { convertToBrowserTimezone } from "@/utils/dateTime";

interface Props {
  id: string;
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

const WorkshopViewer = (props: Props) => {
  // Store
  const { loading, data } = useSelector((state: AppState) => state.providers);

  // Hooks
  const router = useRouter();
  const [filter] = useState(new FilterService());
  const { isSuperAdmin } = useCheckRole();

  const getData = async () => {
    filter.expand([
      PROVIDER_RELATIONS.AVATAR,
      PROVIDER_RELATIONS.CONTACTS,
      PROVIDER_RELATIONS.SCHEDULES,
      PROVIDER_RELATIONS.SCHEDULE_DAY_OFFS,
      PROVIDER_RELATIONS.SERVICES,
      PROVIDER_RELATIONS.SERVICES_VEHICLE_TYPE,
      PROVIDER_RELATIONS.PHOTOS,
    ]);
    try {
      await providersActions.get(props.id, filter.filter);
    } catch (error) {
      router.push(ADMIN_PATH.NOT_FOUND);
    }
  };

  useEffect(() => {
    getData();
  }, [props.id]);

  const workshopDataOnly = useMemo(() => {
    if (!data) return null;
    const { relations, ...generalData } = data;
    return generalData;
  }, [data]);

  const schedule = useMemo(() => {
    if (data?.relations?.schedule) {
      const dayOffs = data.relations.schedule.day_offs?.map(
        (dayId: number) => DAYS_OF_WEEK.find(day => day.id === dayId)?.name
      );

      return {
        "Working hours": `${convertToBrowserTimezone(data.relations.schedule.start_time).slice(0, 5)} - ${convertToBrowserTimezone(data.relations.schedule.end_time).slice(0, 5)}`,
        "Lunch time": `${convertToBrowserTimezone(data.relations.schedule.lunch_start_time).slice(0, 5)} - ${convertToBrowserTimezone(data.relations.schedule.lunch_end_time).slice(0, 5)}`,
        "Days off": dayOffs?.join(", ") || "None",
        "Extra days off": data.relations.schedule.extra_day_offs?.join(", ") || "-"
      };
    }
    return null;
  }, [data]);

  const contacts = useMemo(() => {
    if (data?.relations?.contacts?.length) {
      return data.relations.contacts.reduce((acc: any, contact, index) => {
        acc[`Contact #${index + 1}`] = {
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          relationship: contact.relationship,
        };
        return acc;
      }, {});
    }
    return null;
  }, [data]);

  const breadcrumbs = useMemo(() => {
    const resp: any[] = [
      { url: ADMIN_MAIN, text: "Dashboard" },
    ];
    if (isSuperAdmin) {
      resp.push({ url: ADMIN_PATH.WORKSHOPS, text: "Workshops" });
    }
    resp.push({ url: false, text: "View details" });
    return resp;
  }, [isSuperAdmin]);

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          title="Workshop view details"
          urlSlug={isSuperAdmin ? ADMIN_PATH.WORKSHOPS : undefined}
          breadcrumbs={breadcrumbs}
        >
          <AdminEditButton />
        </ContentHeader>

        <Loader isLoading={loading} />
        <CRUDNotFound loading={loading} data={data} id={props.id} />

        {workshopDataOnly && (
          <UniversalViewer data={workshopDataOnly} defaultOpen />
        )}

        {schedule && (
          <UniversalViewer data={schedule} title="Schedule" defaultOpen />
        )}

        {contacts && (
          <UniversalViewer data={contacts} title="Contacts" defaultOpen />
        )}

        {data?.relations?.photos && data?.relations?.photos?.length > 0 && (
          <UniversalViewer
            data={data.relations.photos}
            title="Photos"
            defaultOpen
          />
        )}

        {data?.relations?.services && data?.relations?.services?.length > 0 && (
          <UniversalViewer
            data={data.relations.services}
            title="Services"
            defaultOpen
          />
        )}
      </div>
    </>
  );
};

export default WorkshopViewer;

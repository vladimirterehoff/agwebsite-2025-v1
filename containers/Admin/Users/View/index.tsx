// Libs
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { usersActions } from "@/app-redux/users/actions";
import { USER_RELATIONS } from "@/app-redux/users/relations";
import { providersActions } from "@/app-redux/providers/actions";
import { PROVIDER_RELATIONS } from "@/app-redux/providers/relations";
// MUI Components
import { Accordion, Box, Typography } from "@mui/material";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import UniversalViewer from "@/components/Admin/UniversalViewer";
import AdminEditButton from "@/components/Admin/Crud/AdminEditButton";
// Utils
import {convertToBrowserTimezone} from "@/utils/dateTime";
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
// Hooks
import useCheckRole from "@/hooks/useIsAdmin";
// Helpers
import { FilterService } from "@/helpers/filterService";
import {CURRENCY} from "@/utils/constants";
import Link from "next/link";

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

/**
 * User Viewer Container
 * @param props
 * @constructor
 */
const UserViewer = (props: Props) => {
  // Store
  const { loading, data } = useSelector((state: AppState) => state.users);
  const { data: providerData } = useSelector(
    (state: AppState) => state.providers
  );

  /**
   * User data only
   */
  const userDataOnly = useMemo(() => {
    if (!data) return null;
    else {
      const { relations, ...generalData } = data;
      return generalData;
    }
  }, [data]);

  // Hooks
  const router = useRouter();
  const [filter] = useState(new FilterService());
  const [filterProvider] = useState(new FilterService());
  const { isSuperAdmin } = useCheckRole();

  /**
   * Get data
   */
  const getData = async () => {
    filter.expand([USER_RELATIONS.PROVIDER, USER_RELATIONS.ROLES, 'provider.wallet']);
    try {
      await usersActions.get(props.id, filter.filter);
    } catch (error) {
      router.push(ADMIN_PATH.NOT_FOUND);
    }
  };

  /**
   * Lifecycle - Get data
   */
  useEffect(() => {
    getData();
  }, [props.id]);

  /**
   * Get provider data
   */
  const getProviderData = async () => {
    if (data?.relations?.provider) {
      filterProvider.expand([
        PROVIDER_RELATIONS.CITY_ZONES,
        PROVIDER_RELATIONS.SCHEDULES,
        PROVIDER_RELATIONS.SCHEDULE_DAY_OFFS,
        'wallet'
      ]);
      await providersActions.get(
        data.relations.provider.id,
        filterProvider.filter
      );
    }
  };

  /**
   * Lifecycle - Get provider data
   */
  useEffect(() => {
    getProviderData();
  }, [data]);

  const cleanerSchedule = useMemo(() => {
    if (providerData?.relations?.schedule) {
      return {
        schedule: providerData?.relations?.schedule,
      };
    }
    return null;
  }, [providerData]);

  const breadcrumbs = useMemo(() => {
    const resp: any[] = [
      { url: ADMIN_MAIN, text: "Dashboard" },
    ];
    if (isSuperAdmin) {
      resp.push({ url: ADMIN_PATH.USERS, text: "Users" });
    }
    resp.push({ url: false, text: "View details" });
    return resp;
  }, [isSuperAdmin]);

  /**
   * Clear data on unmount component
   * */
  useEffect(() => {
    return () => {
      usersActions.clearData();
      providersActions.clearData();
    };
  }, []);

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          title="User view details"
          urlSlug={isSuperAdmin ? ADMIN_PATH.USERS : undefined}
          breadcrumbs={breadcrumbs}
        >
          <AdminEditButton />
        </ContentHeader>

        <Loader isLoading={loading} />
        <CRUDNotFound loading={loading} data={data} id={props.id} />

        {userDataOnly ? (
          <UniversalViewer data={userDataOnly} defaultOpen />
        ) : null}

        {providerData ? (
          <Accordion defaultExpanded sx={{padding: 2}}>
            <Typography variant="h6">Cleaner data</Typography>
            <br/>
            <Typography>
              <b>Cleaner ID:</b> {providerData.id}
            </Typography>
            <Typography>
              <b>Wallet balance:</b> {CURRENCY}{providerData.relations?.wallet?.balance}
            </Typography>
            <Typography>
              <b>Rating:</b> {providerData.rating ?? 'No reviews have been added yet.'}
            </Typography>
            <br/>

            <Typography variant="h6">City Zones</Typography>
            <br/>

            <Box paddingX={2}>
              <ol style={{listStyleType: "number"}}>
                {providerData.relations?.cityZones?.map(
                  (cityZone: any) => (
                    <Fragment key={cityZone.id}>
                      <li>
                        <Typography>
                          <b>Name:</b> {cityZone.name.en}
                        </Typography>

                        <Typography>
                          <b>City:</b> {cityZone.relations.city.name.en}
                        </Typography>
                      </li>
                    </Fragment>
                  )
                )}
              </ol>
            </Box>

            <br/>
            <Typography>
              <Link href={`${ADMIN_PATH.ORDERS}?provider_id=${providerData.id}&provider_name=${providerData.name.en}`} target={'_blank'}>
                <b>Order history</b>
              </Link>
            </Typography>
          </Accordion>
        ) : null}

        {cleanerSchedule ? (
          <Accordion defaultExpanded sx={{ padding: 2 }}>
            <Typography variant="h6">Cleaner's Schedule</Typography>
            <br />

            <Typography>
              <b>Start time:</b>{" "}
              {convertToBrowserTimezone(cleanerSchedule.schedule.start_time)}
            </Typography>
            <Typography>
              <b>End time:</b> {convertToBrowserTimezone(cleanerSchedule.schedule?.end_time)}
            </Typography>

            <Typography>
              <b>Lunch time start:</b>{" "}
              {convertToBrowserTimezone(cleanerSchedule.schedule.lunch_start_time)}
            </Typography>
            <Typography>
              <b>Lunch time end:</b>{" "}
              {convertToBrowserTimezone(cleanerSchedule.schedule.lunch_end_time)}
            </Typography>

            <Typography>
              <b>Days off:</b>{" "}
              {cleanerSchedule.schedule.day_offs
                .map(
                  (dayOff: number) =>
                    DAYS_OF_WEEK.find((day) => day.id === dayOff)?.name
                )
                .join(", ")}
            </Typography>
          </Accordion>
        ) : null}
      </div>
    </>
  );
};

export default UserViewer;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { AppState } from "@/app-redux/state";
import { contactUsActions } from "@/app-redux/contactUs/actions";
import { CONTACT_US_RELATIONS } from "@/app-redux/contactUs/relations";
import { Box, Card } from "@mui/material";
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import UniversalViewer from "@/components/Admin/UniversalViewer";
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import { FilterService } from "@/helpers/filterService";

interface Props {
  id: string;
}

const ContactUsViewer = (props: Props) => {
  const { loading, data } = useSelector((state: AppState) => state.contactUs);
  const router = useRouter();
  const [filter] = useState(new FilterService());

  const getData = async () => {
    filter.expand([
      CONTACT_US_RELATIONS.USER,
      // CONTACT_US_RELATIONS.USER_AVATAR,
      CONTACT_US_RELATIONS.PHOTOS,
    ]);
    try {
      await contactUsActions.get(props.id, filter.filter);
    } catch (error) {
      router.push(ADMIN_PATH.NOT_FOUND);
    }
  };

  useEffect(() => {
    getData();
  }, [props.id]);

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          title="Contact Us"
          urlSlug={ADMIN_PATH.CONTACT_US}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: ADMIN_PATH.CONTACT_US, text: "Contact Us" },
            { url: false, text: "View" },
          ]}
        />

        <Loader isLoading={loading} />
        <CRUDNotFound loading={loading} data={data} id={props.id} />

        {data ? <UniversalViewer data={data} defaultOpen/> : null}
        {data?.relations?.photos ? <UniversalViewer defaultOpen data={data?.relations?.photos} title="Photos" /> : null}
        {data?.relations?.user ? <UniversalViewer data={data?.relations?.user} title="User" /> : null}
      </div>
    </>
  );
};

export default ContactUsViewer; 
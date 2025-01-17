// Libs
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
// Redux
import { AppState } from "@/app-redux/state";
import { ordersActions } from "@/app-redux/orders/actions";
import { ORDER_RELATIONS } from "@/app-redux/orders/relations";
// Components
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import UniversalViewer from "@/components/Admin/UniversalViewer";
// Constants
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import { useRouter } from "next/router";
import { FilterService } from "@/helpers/filterService";
import GoogleMapField from "@/components/Common/FormComponents/GoogleMapField";
import GoogleMapView from "@/components/Admin/GoogleMapView";
import { Box } from "@mui/material";
import { MultiLangString } from "@/app-redux/COMMON/model/multilang";
import { PROVIDER_STATUS } from "@/app-redux/providers/model";
import { IconButton, Tooltip } from "@mui/material";
import { notify } from "@/helpers/notify";
import { useConfirm } from "@/hooks/dialog/useConfirm";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

interface Props {
  id: string;
}

interface ProviderWithContacts extends Record<string, any> {
  user_id: number;
  name: MultiLangString;
  description: MultiLangString;
  type: null;
  availability: string;
  status: PROVIDER_STATUS;
  is_active: boolean;
  id: number;
  created_at: number;
  updated_at: number;
}

/**
 * Order Viewer Container
 * @param props
 * @constructor
 */
const OrderViewer = (props: Props) => {
  // Store
  const { loading, data } = useSelector((state: AppState) => state.orders);

  const router = useRouter();
  const [filter] = useState(new FilterService());

  const getData = async () => {
    filter.expand(Object.values(ORDER_RELATIONS));
    try {
      await ordersActions.get(props.id, filter.filter);
    } catch (error) {
      router.push(ADMIN_PATH.NOT_FOUND);
    }
  };

  useEffect(() => {
    getData();
  }, [props.id]);

  const provider = useMemo(() => {
    if (data?.relations?.provider) {
      const { relations, ...otherData } = data?.relations?.provider;
      const result: ProviderWithContacts = { ...otherData };

      relations?.contacts?.forEach((contact, index) => {
        result[`Contact #${index + 1}`] = {
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          provider_id: contact.provider_id,
          relationship: contact.relationship,
        };
      });

      return result;
    }
  }, [data?.relations?.provider]);

  const handleDelete = async (item: any) => {
    try {
      await ordersActions.delete(item.id);
      notify.success("Order deleted successfully");
      router.push(ADMIN_PATH.ORDERS);
    } catch (error) {
      notify.error("Error deleting order");
    }
  };

  const handleRefund = async () => {
    try {
      await ordersActions.refund(props.id);
      notify.success("Refund successful");
      getData();
    } catch (error) {
      notify.error("Error processing refund");
    }
  };

  const handleSendMoney = async () => {
    try {
      await ordersActions.sendMoney(props.id);
      notify.success("Money sent successfully");
      getData();
    } catch (error) {
      notify.error("Error sending money");
    }
  };

  const [deleteModal, openDeleteModal] = useConfirm(
    "DELETE",
    "Are you sure you want to delete this order?",
    () => handleDelete(data)
  );

  const [refundDialog, openRefundDialog] = useConfirm(
    "Refund Order",
    "Are you sure you want to refund this order?",
    () => handleRefund()
  );

  const [sendMoneyDialog, openSendMoneyDialog] = useConfirm(
    "Send Money to Provider",
    `Are you sure you want to send money to ${
      data?.relations?.provider?.name?.en || "provider"
    }?`,
    () => handleSendMoney()
  );

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          modelName="Order"
          urlSlug={ADMIN_PATH.ORDERS}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: ADMIN_PATH.ORDERS, text: "Orders" },
            { url: false, text: "View details" },
          ]}
        >
        </ContentHeader>

        <Loader isLoading={loading} />
        <CRUDNotFound loading={loading} data={data} id={props.id} />

        {data ? <UniversalViewer data={data} defaultOpen /> : null}
        {data?.coordinates ? (
          <Box mb={2}>
            <GoogleMapView
              markerPosition={
                data?.coordinates?.coordinates
                  ? {
                      lat: data?.coordinates?.coordinates[1],
                      lng: data?.coordinates?.coordinates[0],
                    }
                  : undefined
              }
            />
          </Box>
        ) : null}
        {
          <UniversalViewer
            data={data?.relations?.user}
            title="Client info"
            emptyText="Deleted user"
          />
        }
        {
          <UniversalViewer
            data={provider}
            title="Assigned Workshop/Cleaner"
            emptyText="Deleted"
          />
        }
        {data?.relations?.beforePhotos ? (
          <UniversalViewer
            data={data?.relations?.beforePhotos}
            title="Photos before"
          />
        ) : null}
        {data?.relations?.afterPhotos ? (
          <UniversalViewer
            data={data?.relations?.afterPhotos}
            title="Photos after"
          />
        ) : null}
        {data?.relations?.logs ? (
          <UniversalViewer data={data?.relations?.logs} title="Logs" />
        ) : null}

        {deleteModal}
        {refundDialog}
        {sendMoneyDialog}
      </div>
    </>
  );
};

export default OrderViewer;

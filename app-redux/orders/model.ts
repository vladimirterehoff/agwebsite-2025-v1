import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { Media } from "../COMMON/model/media";
import { Provider } from "../providers/model";
import { Review } from "../reviews/model";
import { Service } from "../services/model";
import { User } from "../users/model";
import { Vehicle } from "../vehicles/model";
import { VehicleType } from "../vehicleTypes/model";

/**
 * @interface Order
 */
export interface Order extends CrudItem {
  address: string;
  code: string;
  coordinates: {type: string; coordinates: [number, number]};
  customer_phone: string; // "+34098908434"
  decline_description: string | null; // ???
  decline_reason: string | null; // ???
  end_datetime: number | null; // ???
  is_schedule: boolean;
  payment_card_id: number | null;
  payment_method: string; // "card",
  payment_status: ORDER_PAYMENT_STATUS;
  provider_id: number;
  provider_phone: string; // "+34098908431"
  start_datetime: number | null; // ???
  status: ORDER_STATUS;
  total_qty: number;
  total: string; // "200.00"
  total_transferred: string; // "200.00"
  type: ORDER_TYPE;
  user_id: number;
  vehicle_id: number;
  relations?: OrderRelations; // ???
}



export enum ORDER_PAYMENT_STATUS {
  PAID = "paid",
  UNPAID = "unpaid",
}

export enum ORDER_STATUS {
  PLACED = "placed",
  WAITING_CUSTOMER_APPROVE = "waiting_customer_approve",
  UPCOMING = "upcoming",
  SCHEDULED = "scheduled",
  EN_ROUTE = "en_route",
  ARRIVED = "arrived",
  WORK_STARTED = "work_started",
  FINISHED = "finished",
  DECLINED_BY_CUSTOMER = "declined_by_customer",
  DECLINED_BY_CLEANER = "declined_by_cleaner",
  DECLINED = "declined",
}
export enum WORKSHOP_ORDER_STATUS {
  PLACED = "placed",
  UPCOMING = "upcoming",
  SCHEDULED = "scheduled",
  FINISHED = "finished",
  DECLINED_BY_CUSTOMER = "declined_by_customer",
  DECLINED = "declined",
}

export enum ORDER_TYPE {
  MOBILE = "mobile",
  STATIONARY = "stationary",
}

export enum WORKSHOP_ORDER_TYPE {
  STATIONARY = "stationary",
}

/**
 * @interface OrderRelations
 */
interface OrderRelations {
  user?: User;
  provider?: Provider;
  vehicle?: Vehicle;
  afterPhotos?: Media[];
  beforePhotos?: Media[];
  items?: OrderItem[];
  logs?: OrderLog[];
  paymentCard?: any;
  providerRequests?: OrderProviderRequest[];
  review?: Review;
}

/**
 * @interface OrderProviderRequest
 */
interface OrderProviderRequest extends CrudItem {
  arrival_datetime: number;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  decline_description: string | null;
  decline_reason: string | null;
  distance: string | null;
  order_id: number;
  provider_id: number;
  status: string;
  relations: {
    provider?: Provider;
  };
}

interface OrderLog extends CrudItem {
  data: null;
  description: string;
  order_id: number;
  type: string;
}

/**
 * @interface OrderItem
 */
export interface OrderItem extends CrudItem {
  order_id  : number;
  service_id: number;
  price: string;
  qty: number;
  relations: {
    service?: Service;
  };

service_model: ServiceModel;
}

/**
 * @interface ServiceModel
 */
interface ServiceModel {
  availability: string;
  description: string;
  name: string;
  relations: {
    vehicleTypes?: VehicleType[];
  };
  type: string | null;
  user_id: number;
}

/**
 * @interface OrdersState
 */
export interface OrdersState extends crudState<Order> {
  refundableNumber: number;
}

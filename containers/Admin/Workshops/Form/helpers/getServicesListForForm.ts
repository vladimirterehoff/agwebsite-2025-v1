import { Service, ServiceVehicleType } from "@/app-redux/services/model";
import { VehicleType } from "@/app-redux/vehicleTypes/model";

export type ServiceFormItem = {
  id: number;
  name: string;
  vehicle_types: {
    id: number;
    name: string;
    isChecked: boolean;
    price: number  | null;
    time: number | null;
  }[];
}
type GetServicesListForForm = (services: Service[] | [], vehicleTypes: VehicleType[] | []) => ServiceFormItem[];

export const getServicesListForForm: GetServicesListForForm = (services, vehicleTypes) => {
  if (services?.length && vehicleTypes?.length) {
  const newServices = services?.map((ser) => ({
    id: ser.id,
    name: ser.name.en,
    vehicle_types: vehicleTypes?.map((t) => {
      const serviceVehicleType = ser.relations?.vehicleTypes?.find((vt: any) => vt.id === t.id);
      return {
        id: t.id,
        name: t.name.en,
        isChecked: Boolean(serviceVehicleType),
        price: serviceVehicleType?.price || null,
        time: serviceVehicleType?.time || null,
      };
    })
  })) || [];
  
  return newServices;
} else {
  return [];
}
};

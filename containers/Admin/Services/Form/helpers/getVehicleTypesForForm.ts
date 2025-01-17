import { Service } from "@/app-redux/services/model";
import { VehicleType } from "@/app-redux/vehicleTypes/model";

export type VehicleTypesFormItem = {
    id: number;
    name: string;
    isChecked: boolean;
    price: number  | null;
    time: number | null;
}
type GetVehicleTypesForForm = (service: Service | null, vehicleTypes: VehicleType[] | []) => VehicleTypesFormItem[] | undefined;

export const getVehicleTypesForForm: GetVehicleTypesForForm = (service, vehicleTypes) => {
  if (vehicleTypes?.length) {
    const newVehicleTypes = vehicleTypes?.map((t) => {
      const serviceVehicleType = service?.relations?.vehicleTypes?.find((vt: any) => vt.id === t.id);
      return {
        id: t.id,
        name: t.name.en,
        isChecked: Boolean(serviceVehicleType),
        price: serviceVehicleType?.price || null,
        time: serviceVehicleType?.time || null,
      };
    }) || undefined;
  
  return newVehicleTypes as VehicleTypesFormItem[];
} else {
  return undefined;
}
};

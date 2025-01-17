export enum SERVICE_RELATIONS {
  // AVATAR = "avatar",
  // USER = "user",
  USER_AVATAR = "user.avatar",
  VEHICEL_TYPES = "vehicleTypes",
  VEHICEL_TYPES_TRANSLATIONS = "vehicleTypes.translations",
}


// Available scopes

// withBasicVehicleTypes
// With attached basic vehicle types
// ?scopes=[{"name":"withBasicVehicleTypes","parameters":[]}]

// withWorkshopVehicleTypes
// With attached workshop vehicle types, parameter is Workshop ID
// ?scopes=[{"name":"withWorkshopVehicleTypes","parameters":[1]}]

// byVehicleTypeAndProvider
// Returns available services for the given vehicle type and providers. In mobile order provider_id is null
// ?scopes=[{"name":"byVehicleTypeAndProvider","parameters":[{vehicle_type_id}, {provider_id|null}]}]



export enum PROVIDER_RELATIONS {
  AVATAR = "avatar",
  USER = "user",
  USER_AVATAR = "user.avatar",
  CONTACTS = "contacts",
  SERVICES = "services",
  SERVICES_VEHICLE_TYPE = "services.vehicleTypes",
  SCHEDULES = "schedules",
  SCHEDULE_DAY_OFFS = "scheduleDayOffs",
  WALLET = "wallet",
  PHOTOS = "photos",
  CITY_ZONES = "cityZones.city",
}

// Available scopes

// withinPolygon
// Return provider within polygon. Polygon is defined by the top-left and bottom-right corners.
// ?scopes=[{"name":"withinPolygon","parameters":[{minLat},{minLng},{maxLat},{maxLng}]}]

// withTotal
// Return stationary providers with total field by vehicle type and services. Returns only providers who can provide all passed services.
// ?scopes=[{"name":"withTotal","parameters":[{vehicle_type_id},[{service_id},{service_id}]]}]

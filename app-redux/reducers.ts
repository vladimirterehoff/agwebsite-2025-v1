import { default as authReducer } from '@/app-redux/auth/reducer';
import { default as langReducer } from "@/app-redux/lang/reducer";
import { default as profileReducer } from '@/app-redux/profile/reducer';
import { default as usersReducer } from '@/app-redux/users/reducer';
import { default as crudExampleReducer } from "@/app-redux/crudExample/reducer";
import { default as staticPagesReducer } from "@/app-redux/staticPages/reducer";
import { default as manufacturersReducer } from "@/app-redux/manufacturers/reducer";
import { default as vehiclesReducer } from "@/app-redux/vehicles/reducer";
import { default as vehicleTypesReducer } from "@/app-redux/vehicleTypes/reducer";
import { default as rolesReducer } from "@/app-redux/roles/reducer";
import { default as servicesReducer } from "@/app-redux/services/reducer";
import { default as providersReducer } from "@/app-redux/providers/reducer";
import { default as ordersReducer } from "@/app-redux/orders/reducer";
import { default as citiesReducer } from "@/app-redux/cities/reducer";
import { default as cityZonesReducer } from "@/app-redux/cityZones/reducer";
import { default as reviewsReducer } from "@/app-redux/reviews/reducer";
import { default as contactUsReducer } from "@/app-redux/contactUs/reducer";
import { default as reportsCleanerReducer } from '@/app-redux/reportsCleaner/reducer';
import { default as reportsServiceReducer } from '@/app-redux/reportsService/reducer';
import { default as withdrawalsReducer } from '@/app-redux/withdrawals/reducer';
import { default as ordersGraphReducer } from '@/app-redux/dashboard/reducer';
import { settingsReducer } from "app-redux/settings";
import { combineReducers } from "redux";

export const reducers: any = combineReducers({
    auth: authReducer,
    cities: citiesReducer,
    cityZones: cityZonesReducer,
    crudExample: crudExampleReducer,
    lang: langReducer,
    manufacturers: manufacturersReducer,
    orders: ordersReducer,
    profile: profileReducer,
    providers: providersReducer,
    reviews: reviewsReducer,
    roles: rolesReducer,
    services: servicesReducer,
    settings: settingsReducer,
    staticPages: staticPagesReducer,
    users: usersReducer,
    vehicles: vehiclesReducer,
    vehicleTypes: vehicleTypesReducer,
    contactUs: contactUsReducer,
    reportsCleaner: reportsCleanerReducer,
    reportsService: reportsServiceReducer,
    withdrawals: withdrawalsReducer,
    ordersGraph: ordersGraphReducer,
})

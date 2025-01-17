import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { MultiLangString } from "../COMMON/model/multilang";
import {City} from "@/app-redux/cities/model";
import {Coordinates} from "@/app-redux/COMMON/model/coordinates";

/**
 * @interface CityZone
 */
export interface CityZone extends CrudItem {
  city_id: number;
  name: MultiLangString;
  polygon: Coordinates[];
  color: string;
  relations?: CityZoneRelations;
}

/**
 * @interface CityZoneRelations
 */
interface CityZoneRelations {
  city?: City;
}

/**
 * @interface CityZonesState
 */
export interface CityZonesState extends crudState<CityZone> {}

import {crudState} from "../COMMON/crud";
import { MultiLangString } from "../COMMON/model/multilang";

/**
 * @interface StaticPage
 */
export interface StaticPage {
  id: number;
  created_at: number;
  description: MultiLangString;
  name: MultiLangString;
  slug: string;
  updated_at: number;
}

/**
 * @interface StaticPageState
 */
export interface StaticPageState extends crudState<StaticPage>{}




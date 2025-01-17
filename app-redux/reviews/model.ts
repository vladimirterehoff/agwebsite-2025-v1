import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { Provider } from "../providers/model";
import { User } from "../users/model";

/**
 * @interface Service
 */
export interface Review extends CrudItem {
  user_id: number;
  order_id: number;
  provider_id: number;
  description: string;
  rating: number;
  is_active: boolean;
  relations?: {
    user: User;
    provider: Provider;
  };
}

/**
 * @interface ReviewsState
 */
export interface ReviewsState extends crudState<Review> {}

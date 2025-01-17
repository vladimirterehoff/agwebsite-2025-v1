import { crudState } from "../COMMON/crud";
import { CrudItem } from "../COMMON/model/crudItem";
import { Provider } from "../providers/model";
/**
 * @interface Withdrawal
 */
export interface Withdrawal extends CrudItem {
  provider_id: number;
  amount: string; // decimal as string "100.50"
  comment: string | null;
  relations?: WithdrawalRelations;
}

/**
 * @interface WithdrawalRelations
 */
interface WithdrawalRelations {
  provider?: Provider;
}

/**
 * @interface WithdrawalsState
 */
export interface WithdrawalsState extends crudState<Withdrawal> {} 
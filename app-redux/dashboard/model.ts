/**
 * @interface OrdersGraph
 */
export interface OrdersGraph {
  date: string;
  orders_count: number;
}

/**
 * @interface OrdersGraphState
 */
export interface OrdersGraphState {
  loading: boolean;
  error?: string | null;
  data: OrdersGraph[];
}

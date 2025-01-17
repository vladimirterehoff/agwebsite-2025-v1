import {crudState} from "../COMMON/crud";
import {CrudItem} from "../COMMON/model/crudItem";
import {Media} from "../COMMON/model/media";
import {User} from "../users/model";

/**
 * @interface ContactUs
 */
export interface ContactUs extends CrudItem {
  "user_id": number;
  "email": string
  "type": CONTACT_US_TYPE,
  "description": string,
  relations: {
    user: User,
    photos: Media[],
  },
}

export enum CONTACT_US_TYPE {
  TECHNICAL_SUPPORT = 'technical_support',
  ACCOUNT_ISSUES = 'account_issues',
  BILLING_AND_PAYMENTS = 'billing_payments',
  ORDER_SERVICE = 'order_related',
  ISSUE = 'service_issue',
  REPORT_MISCONDUCT = 'report_misconduct',
  FEEDBACK_SUGGESTIONS = 'feedback_suggestions',
  FEATURE_REQUEST = 'feature_request',
  REPORT_BUG = 'bug_report',
}

/**
 * @interface ContactUsOption
 */
export interface ContactUsOption {
  id: number;
  key: string;
  name: string;
}

/**
 * @interface ContactUsState
 */
export interface ContactUsState extends crudState<ContactUs> {
  options: ContactUsOption[];
  loadingOptions: boolean;
}

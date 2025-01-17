import { crudActionTypes } from '../COMMON/crud/actionTypes';

/**
 * Action Types for dispatch of ContactUs state
 */
export const ACTION_TYPES = {
  ...crudActionTypes('CONTACT_US'),
  GET_OPTIONS: 'CONTACT_US_GET_OPTIONS',
  GET_OPTIONS_SUCCESS: 'CONTACT_US_GET_OPTIONS_SUCCESS',
  GET_OPTIONS_ERROR: 'CONTACT_US_GET_OPTIONS_ERROR',
}; 
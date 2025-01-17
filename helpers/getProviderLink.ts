import {Provider, PROVIDER_TYPE} from "@/app-redux/providers/model";
import {ADMIN_PATH} from "@/utils/routers/admin";

export const getProviderLink = (provider: Provider|null|undefined): string => {

  if (provider) {
    if (provider && provider.type === PROVIDER_TYPE.MOBILE) {
      return `${ADMIN_PATH.USERS}/${provider.user_id}/view`;
    }

    return `${ADMIN_PATH.WORKSHOPS}/${provider.id}/view`;
  }

  return '#';
};

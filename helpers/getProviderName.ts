import { Provider, PROVIDER_TYPE } from "@/app-redux/providers/model";

export const getProviderName = (provider: Provider | null | undefined): string => {
  if (provider === undefined) return '-';

  let name, type;

  if (provider &&provider.type === PROVIDER_TYPE.MOBILE) {
    if (provider.relations?.user) {
      name = provider.relations?.user?.first_name + ' ' + provider.relations?.user?.last_name;
    } else if (provider.relations?.user === null) {
      name = 'Deleted';
    } else {
      name = provider.name?.en;
    }
    type = 'Cleaner';
  } else {
    if (provider === null) {
      name = 'Deleted';
    } else {
      name = provider.name.en;
    }
    type = 'Workshop';
  }

  return `${name} (${type})`;
};

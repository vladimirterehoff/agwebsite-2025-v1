import { Provider, PROVIDER_TYPE } from "@/app-redux/providers/model";
import { getProviderLink } from "@/helpers/getProviderLink";
import { getProviderName } from "@/helpers/getProviderName";
import { Link } from "@mui/material";

/**
 * ProviderLink component
 * @param provider - Provider object
 * @description Displays a link to the provider's profile or a deleted user message
 */
const ProviderLink = ({
  provider,
}: {
  provider: Provider | null | undefined;
}) => {
  const link = getProviderLink(provider);

  if (provider === undefined) return <span>-</span>;
  if (
    link === "#" ||
    (provider &&
      provider?.type === PROVIDER_TYPE.MOBILE &&
      provider?.relations?.user === null) ||
    provider === null
  ) {
    return <>{getProviderName(provider)}</>
  } else {
    return (
      <Link href={getProviderLink(provider)}>{getProviderName(provider)}</Link>
    );
  }
};

export default ProviderLink;

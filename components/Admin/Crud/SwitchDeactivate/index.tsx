// Libs
import { useState } from 'react';
// MUI Components
import { Switch as MuiSwitch } from '@mui/material';
// Helpers
import { notify } from 'helpers/notify';
import { useRequestErrors } from 'hooks/useRequestErrors';

type Props = {
  data: any;
  checked: boolean;
  action: any;
  text?: {
    successActivate?: string;
    successDeactivate?: string;
    error?: string;
  };
  callBackOnSuccess?: () => void;
};

const SwitchDeactivate = ({ data, checked, action, text, callBackOnSuccess }: Props) => {
  const [active, setActive] = useState(checked);
  const [errors, setErrors] = useState<string[]>();
  const { requestError } = useRequestErrors();

  const onChange = async () => {
    const currentActiveState = active;
    try {
      setErrors(undefined)
      setActive(!currentActiveState);

      if (currentActiveState) {
        await action.deactivate(data.id);
        notify.success(text?.successDeactivate || 'Successfully deactivated!')
      } else {
        await action.activate(data.id);
        notify.success(text?.successActivate || 'Successfully activated!')
      }
      if (callBackOnSuccess) callBackOnSuccess();
    } catch (error: any) {
      setActive(currentActiveState);
      requestError(error)
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <MuiSwitch
        name={`${data.id}_is_active`}
        color="primary"
        onChange={onChange}
        checked={active}
        size="small"
      />
      {errors?.length ? (
        <div className="error-text">
          {errors.map((error) => (
            <>
              {error}
              <br />
            </>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SwitchDeactivate;

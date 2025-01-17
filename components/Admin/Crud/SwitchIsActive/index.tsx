// Libs
import { useEffect, useState } from 'react';
// MUI Components
import { Switch as MuiSwitch } from '@mui/material';
// Helpers
import { notify } from 'helpers/notify';
import { useRequestErrors } from 'hooks/useRequestErrors';

type Props = {
  data: any;
  action: any;
  text?: {
    success?: string;
    error?: string;
  };
  callBackOnSuccess?: () => void;
  save?: 'all' | 'value'
};

const SwitchIsActive = ({ data, action, text, callBackOnSuccess, save = 'all' }: Props) => {
  const [active, setActive] = useState(Boolean(data?.is_active));
  const [errors, setErrors] = useState<string[]>();
  const { requestError } = useRequestErrors();

  const onChange = async () => {
    const currentActiveState = active;
    try {
      setErrors(undefined)
      setActive(!currentActiveState);

      const newData = save === 'value' ? {
        id: data.id,
        is_active: !currentActiveState,
      } : {
        ...data,
        is_active: !currentActiveState,
      }
      await action.submit(newData);
      notify.success(text?.success || 'Successfully changed!')
      if (callBackOnSuccess) callBackOnSuccess();
    } catch (error: any) {
      setActive(currentActiveState);
      requestError(error)
    }
  };

  useEffect(() => {
    if (data.is_active !== undefined && active !== data.is_active) {
      setActive(Boolean(data.is_active));
    }
  }, [data?.is_active])

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

export default SwitchIsActive;

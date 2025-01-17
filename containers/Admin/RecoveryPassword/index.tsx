import { useState } from 'react';
import OtpForm from './OtpForm/Form';
import PhoneForm from './PhoneForm';

const Recovery_Password = () => {
  const [phone, setPhone] = useState<string>('');
  const [showOtpForm, setShowOtpForm] = useState<boolean>(false);

  const onSubmitCallback = (phone: string) => {
    setPhone(phone);
    setShowOtpForm(true)
  }

  if (showOtpForm) {
    return <OtpForm phone={phone} goBack={() => setShowOtpForm(false)}/>
  } else {
    return <PhoneForm onSubmitCallback={onSubmitCallback} />
  }
};

export default Recovery_Password;

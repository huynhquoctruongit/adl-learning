import { useState } from 'react';

import Input from '../input';

export const FInput = ({ field, form, ...rest }) => {
  return <Input {...field} {...rest} />;
};

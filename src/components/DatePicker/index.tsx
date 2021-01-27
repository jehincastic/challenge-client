import React from 'react';
import { KeyboardDatePicker } from "@material-ui/pickers";

const DatePickerField: React.FC<any> = ({ field, form, ...other }) => {
  return (
    <KeyboardDatePicker
      clearable={true}
      name={field.name}
      value={field.value}
      format="dd/MM/yyyy"
      onChange={date => form.setFieldValue(field.name, date, false)}
      {...other}
    />
  );
};

export default DatePickerField;
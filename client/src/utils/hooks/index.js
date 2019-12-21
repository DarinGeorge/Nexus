import React from 'react';
import { useSnackbar } from 'notistack';

// Use Form Hook ---------------------------------

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = React.useState(initialState);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();

  console.log(errors);

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });

    if (Object.keys(errors).length) {
      console.log('clearing errors');

      if (errors.general) {
        setErrors({ ...errors, general: '' });
      } else {
        setErrors({ ...errors, [e.target.name]: '' });
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    callback();
  };

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSubmitting(false);

      Object.values(errors).forEach(value => {
        // variant could be success, error, warning, info, or default
        value !== '' &&
          enqueueSnackbar(value, {
            variant: 'error',
            autoHideDuration: 3000
          });
      });
    }
  }, [errors, callback, enqueueSnackbar]);

  return {
    handleSubmit,
    handleChange,
    values,
    submitting,
    errors,
    setErrors
  };
};

// End Use Form Hook -----------------------------

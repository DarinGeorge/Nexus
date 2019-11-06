import React from 'react';
import { useSnackbar } from 'notistack';

// Use Form Hook ---------------------------------

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = React.useState(initialState);
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
  };

  React.useEffect(() => {
    if (submitting) {
      let errCheck = Object.keys(errors).length > 0;
      if (errCheck) {
        setSubmitting(false);
        Object.values(errors).map(value => {
          // variant could be success, error, warning, info, or default
          const handleNotify = variant => {
            enqueueSnackbar(value, {
              variant,
              autoHideDuration: 3000
            });
          };

          handleNotify('error');
          setTimeout(function () {
            setErrors({});
          }, 5000);
          return errors;
        });
      } else {
        setSubmitting(false);
        callback();
      }
    }
  }, [submitting, errors, callback, enqueueSnackbar]);

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
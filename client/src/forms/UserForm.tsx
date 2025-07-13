import { useMutation } from '@apollo/client'
import { Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { CREATE_USER, GET_USER_DETAILS, GET_USERS, UPDATE_USER } from '../queries/user.query'
import type { User } from '../types/user.type'
import { enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'

interface Props {
  user?: User
  finished(): void
}
export const UserForm = (props: Props) => {
  const [createUser, { loading: creating, error: createError }] = useMutation(CREATE_USER, {
    refetchQueries: [GET_USERS],
    onCompleted: () => {
      props.finished();
    }
  });

  const [updateUser, { loading: updating, error: updateError }] = useMutation(UPDATE_USER, {
    refetchQueries: [GET_USERS, GET_USER_DETAILS],
    onCompleted: () => {
      props.finished();
    }
  });

  useEffect(() => {
    if (createError) enqueueSnackbar(`Error creating user: ${createError.message}`, { variant: 'error' });
  }, [createError]);
  useEffect(() => {
    if (updateError) enqueueSnackbar(`Error updating user: ${updateError.message}`, { variant: 'error' });
  }, [updateError]);

  const formik = useFormik({
    initialValues: {
      firstName: props.user?.firstName || '',
      lastName: props.user?.lastName || '',
      email: props.user?.email || '',
    },
    onSubmit: (values) => {
      if (props.user) {
        updateUser({ variables: { id: props.user.id, ...values } });
      } else {
        createUser({ variables: values });
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="firstName"
          name="firstName"
          label="First Name"
          placeholder="Enter first name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          fullWidth
          id="lastName"
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="Enter email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button variant="contained" type="submit" disabled={creating || updating || formik.isSubmitting} color="primary">
          {formik.isSubmitting ? 'Submitting...' : props.user ? 'Update User' : 'Create User'}
        </Button>
      </form>
    </div>
  )
}

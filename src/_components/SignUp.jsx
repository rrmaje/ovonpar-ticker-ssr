import React from 'react';
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import {NavLink} from 'react-router-dom';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { userService } from '../_services';


const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

}));

export default function SignUp(props) {
  const classes = useStyles();

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>


        <Formik
          initialValues={{
            email: '',
            password: '',
            policy: false
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required('Email is required'),
            password: Yup.string().required('Password is required'),
            policy: Yup.boolean().oneOf([true], 'You must agree to the Policy'),
          })}
          onSubmit={({ email, password, policy}, { setStatus, setSubmitting }) => {
            setStatus();
            userService.newUser(email, password)
              .then(
                user => {
                  props.history.push('/signin');
                },
                error => {
                  setSubmitting(false);
                  setStatus(error);
                }
              );
          }}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              status,
              isSubmitting,
              handleChange,
              handleSubmit,

            } = props;
            return (

              <form className={classes.form} onSubmit={handleSubmit}>
                {status &&
                  <Box my={2} color="error.main">

                    {status}
                  </Box>
                }

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      onChange={handleChange} value={values.email} error={errors.email && touched.email} helperText={(errors.email && touched.email) && errors.email}
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email" autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      onChange={handleChange} margin="normal" value={values.password} error={errors.password && touched.password} helperText={(errors.password && touched.password) && errors.password}
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                    />
                    <FormControlLabel
                control={<Checkbox id="policy" name="policy" color="primary" onChange={handleChange} value={values.policy}/>} 
                />
                {'I agree to the '}<NavLink exact to="/terms" activeStyle={{ color: 'black' }} style={{ color: 'black' }}>Privacy Policy</NavLink>
                {errors.policy &&
                  <Box my={0} color="error.main">
                    {errors.policy}
                  </Box>
                }
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
          </Button>

              </form>

            );

          }}
        </Formik>


        <Grid container justify="flex-end">
          <Grid item>
            <Link to="/signin" variant="body2">
              Already have an account? Sign in
              </Link>
          </Grid>
        </Grid>

      </div>
    </Container>
  );
}


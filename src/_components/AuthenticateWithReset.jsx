import React from 'react';
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { authenticationService } from '../_services';

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  notchedOutline: {
    borderWidth: "1px",
    //borderColor: "green !important"
  },
}));

export default function AuthenticateWithReset(props) {

  const classes = useStyles();

  return (

    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email().required('Email is required'),
            password: Yup.string().required('Password is required')
          })}
          onSubmit={({ email, password}, { setStatus, setSubmitting }) => {
            setStatus();
            let params = new URLSearchParams(location.search);

            let genhash = params.get("genhash");
            authenticationService.loginWithReset(email, password,genhash)
              .then(
                user => {
                  const { from } = props.location.state || { from: { pathname: "/" } };
                  props.history.push(from);
                },
                error => {
                  setSubmitting(false);
                  console.error(error);
                  setStatus('Reset failed');
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
                
                <TextField InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline
                  }
                }} variant="outlined" margin="normal" onChange={handleChange} value={values.email} error={errors.email && touched.email} helperText={(errors.email && touched.email) && errors.email} fullWidth id="email" label="Email Address" name="email" autoFocus />
                <TextField variant="outlined" onChange={handleChange}  margin="normal" value={values.password} error={errors.password && touched.password} helperText={(errors.password && touched.password) && errors.password} fullWidth name="password" label="New Password" type="password" id="password" />
                <Button type="submit" disabled={isSubmitting} fullWidth variant="contained" color="primary" className={classes.submit}>RESET</Button>


              </form>

            );

          }}
        </Formik>
        <Grid container>
          <Grid item>
            <Link to="/signup">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </div>

    </Container>
  )


}

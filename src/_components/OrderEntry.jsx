import React from 'react';
import { Button } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { Box } from '@material-ui/core';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { orderEntry } from '../_services';


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
    alignItems: 'left',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

}));

const sideToString = (side) => {
  return side == 83 ? 'Sell' : 'Buy';
}

export default function OrderEntry(props) {
  const classes = useStyles();

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Order Entry
        </Typography>
        <Box my={1} style={{fontSize: 14}}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
          Side: {sideToString(props.location.state.side)}
          </Grid>
          <Grid item>
          Instrument: {props.location.state.instrument} 
          </Grid>
          </Grid>
       </Box>

        <Formik
          initialValues={{
            side: props.location.state.side,
            instrument: props.location.state.instrument,
            quantity: '',
            price: '',
          }}
          validationSchema={Yup.object().shape({
            side: Yup.number().required('Error, undefined order side'),
            instrument: Yup.string().required('Error, undefined instrument'),
            quantity: Yup.number().integer().positive().required('Quantity is required'),
            price: Yup.number().positive().required('Price is required'),
          })}
          onSubmit={({ side, instrument, quantity, price}, { setStatus, setSubmitting }) => {
            setStatus();
            orderEntry.newOrder(side, instrument, Number(quantity), Number(price))
              .then(
                order => {
                  //props.history.push('/');
                  setSubmitting(false);
                  setStatus('Order Id:'+order.orderId);
                },
                error => {
                  setSubmitting(false);
                  setStatus('Operation failed');
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
                      onChange={handleChange} value={values.quantity} error={errors.quantity && touched.quantity} helperText={(errors.quantity && touched.quantity) && errors.quantity}
                      fullWidth
                      id="quantity"
                      label="Quantity"
                      name="quantity"
                      autoComplete="quantity" autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      onChange={handleChange} margin="normal" value={values.price} error={errors.price && touched.price} helperText={(errors.price && touched.price) && errors.price}
                      fullWidth
                      name="price"
                      label="Price PLN"
                      id="price"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Enter Order
          </Button>
              </form>

            );

          }}
        </Formik>

      </div>
    </Container>
  );
}


import React from 'react'
import {Redirect} from 'react-router'
import {Route, Switch} from 'react-router-dom'
import {Overview} from '../pages/overview/Overview'
import {ROUTE_DASHBOARD} from './constants'

// React Router v4 route syntax for routes when user is not logged in
export const APP_ROUTES = (
  <Switch>
    <Route exact path={ROUTE_DASHBOARD} component={Overview} />

    {/* Redirect to the default page with referrer for any url not found above */}
    <Route
      path="/"
      render={({location}) => (
        <Redirect
          to={{
            pathname: '/',
            state: {referrer: location.pathname},
          }}
        />
      )}
    />
  </Switch>
)

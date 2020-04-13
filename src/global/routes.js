import React from 'react'
import {Redirect} from 'react-router'
import {Route, Switch} from 'react-router-dom'
import {TableOverview} from '../pages/overview/table/TableOverview'
import {ROUTE_TABLE_OVERVIEW} from './constants'

// React Router v4 route syntax for routes when user is not logged in
export const APP_ROUTES = (
  <Switch>
    <Route exact path={ROUTE_TABLE_OVERVIEW} component={TableOverview} />

    {/* Redirect to the default page with referrer for any url not found above */}
    <Route
      path="/"
      render={({location}) => (
        <Redirect
          to={{
            pathname: ROUTE_TABLE_OVERVIEW,
            state: {referrer: location.pathname},
          }}
        />
      )}
    />
  </Switch>
)

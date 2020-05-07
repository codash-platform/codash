import React from 'react'
import ReactDOM from 'react-dom'
import {hot} from 'react-hot-loader/root'
import {I18nextProvider} from 'react-i18next'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {APP_ROUTES} from './global/routes'
import {store} from './global/store'
import i18n from './global/i18n'

const CombinedApp = () => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>{APP_ROUTES}</BrowserRouter>
    </I18nextProvider>
  </Provider>
)

const render = Component => ReactDOM.render(<Component />, document.getElementById('root'))
render(hot(CombinedApp))

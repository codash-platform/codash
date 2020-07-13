import React from 'react'
import ReactDOM from 'react-dom'
import {hot} from 'react-hot-loader/root'
import {I18nextProvider} from 'react-i18next'
import {Provider} from 'react-redux'
import {MainLayout} from './components/MainLayout'
import {i18n} from './global/i18n'
import {store} from './global/store'

const CombinedApp = () => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <MainLayout />
    </I18nextProvider>
  </Provider>
)

const HotCombinedApp = hot(CombinedApp)
ReactDOM.render(<HotCombinedApp />, document.getElementById('root'))

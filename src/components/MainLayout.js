import PropTypes from 'prop-types'
import React from 'react'
import {Container} from 'react-bootstrap'
import {withTranslation} from 'react-i18next'
import {connect} from 'react-redux'
import {Footer} from './Footer'
import {Header} from './Header'

class MainLayoutComponent extends React.Component {
  render({children} = this.props) {
    return (
      <div>
        <Header />
        <Container fluid>{children}</Container>
        <Footer />
      </div>
    )
  }
}

MainLayoutComponent.propTypes = {
  children: PropTypes.element.isRequired,
}

const stateToProps = state => ({})

const dispatchToProps = {}

export const MainLayout = connect(stateToProps, dispatchToProps)(withTranslation()(MainLayoutComponent))

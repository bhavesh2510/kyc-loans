import React from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  CustomerDetails,
  BusinessDetails,
  PrincipalOwner,
  OwnershipDetails,
  ProcessingInformation,
  DocumentsDeclaration,
  MerchantQuestionnaire
} from './Views'
import KycSuccess from './Views/KycSuccess'
import BusinessProperty from './Views/BusinessProperty'

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={CustomerDetails} />
        <Route exact path='/business_details' component={BusinessDetails} />
        <Route exact path='/principal_owner' component={PrincipalOwner} />
        <Route exact path='/business_property' component={BusinessProperty} />
        <Route
          exact
          path='/processing_information'
          component={ProcessingInformation}
        />
        <Route
          exact
          path='/merchant_question'
          component={MerchantQuestionnaire}
        />
        <Route
          exact
          path='/documents_declaration'
          component={DocumentsDeclaration}
        />
        <Route exact path='/kyc_success' component={KycSuccess} />
      </Switch>
    )
  }
}

export default Routes

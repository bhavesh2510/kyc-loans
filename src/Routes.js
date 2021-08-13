import React from 'react';
import {Route, Switch } from 'react-router-dom';
import {
 CustomerDetails,BusinessDetails,BusinessActivities,BankDetails,OwnershipDetails,DocumentsDeclaration } from './Views';

class Routes extends React.Component{
  render () {
    return(
      <Switch>
        <Route exact path="/" component={CustomerDetails} />
        <Route exact path="/business_details" component={BusinessDetails} />
        <Route exact path="/business_activities" component={BusinessActivities} />
        <Route exact path="/bank_details" component={BankDetails} />
        <Route exact path="/ownership_details" component={OwnershipDetails} />
        <Route exact path="/documents_declaration" component={DocumentsDeclaration} />
      </Switch>
    )
  }
}


export default Routes;
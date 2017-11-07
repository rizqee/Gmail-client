import React from 'react'
import {Redirect, Route, Switch} from 'react-router'

import {InboxPage} from '../pages/InboxPage'
import {SentPage} from '../pages/SentPage'
import {MessagePage} from '../pages/MessagePage'
import {SendPage} from '../pages/SendPage'

export default () => (
  <div className='container'>
    <Switch>
      <Route exact path='/inbox' component={InboxPage}/>
      <Route exact path='/sent' render={SentPage}/>
      <Route exact path='/messages/:id' component={MessagePage}/>
      <Route exact path='/send' component={SendPage}/>
      <Route path='/' render={() => <Redirect to='/inbox'/>}/>
    </Switch>
  </div>
);
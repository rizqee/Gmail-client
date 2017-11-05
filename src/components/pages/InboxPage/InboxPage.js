import React from 'react'
import {connect} from 'react-redux'

import {getInbox} from '../../../actions/inboxActionCreators'
import {MessageListPage} from '../MessageListPage'

const InboxPage = (props) => (
  <MessageListPage
    getMessages={props.getInbox}
    isLoading={props.isLoading}
    messages={props.messages}
  />
);

export default connect(
  state => ({
    messages: state.inbox.messages,
    isLoading: state.inbox.isLoading
  }),
  dispatch => ({
    getInbox: () => {
      dispatch(getInbox())
    }
  })
)(InboxPage);
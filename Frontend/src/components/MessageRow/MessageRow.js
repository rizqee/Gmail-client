import React from 'react'
import {connect} from 'react-redux'
import {Col, ListGroupItem, Row} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Moment from 'react-moment';
import renderHtml from 'react-render-html'
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import PropTypes from 'prop-types'
import 'moment-timezone';
import 'moment/locale/id';

import {deleteMessage} from '../../actions/messageListActionCreators'
import './react-contextmenu.css'
import {getHeader} from '../../messageMethods'

const MessageRow = ({deleteMessage, message}) => (
  <LinkContainer to={`/messages/${message.id}`}>
    <ListGroupItem
      id={'row-' + message.id}
      bsStyle={message.isUnread ? 'warning' : null}
    >
      <ContextMenuTrigger id={message.id}>
        <Row>
          <Col sm={3}>
            {getHeader(message, 'From')}
          </Col>
          <Col sm={8}>
            <span style={{whiteSpace:"pre-line",wordWrap:"break-word"}}>
              <b>{getHeader(message, 'Subject')}</b> - {renderHtml(message.snippet)}
            </span>
          </Col>
          <Col sm={1}>
            <i>
              <Moment locale={'en'} fromNow date={getHeader(message, 'Date')}/>
            </i>
          </Col>
        </Row>
      </ContextMenuTrigger>

      <ContextMenu id={message.id}>
        <MenuItem onClick={() => deleteMessage(message)}>delete</MenuItem>
      </ContextMenu>
    </ListGroupItem>
  </LinkContainer>
);

MessageRow.propTypes = {
  deleteMessage: PropTypes.func.isRequired
};

export default connect(
  undefined,
  dispatch => ({
    deleteMessage: (message) => {
      dispatch(deleteMessage(message))
    }
  })
)(MessageRow);
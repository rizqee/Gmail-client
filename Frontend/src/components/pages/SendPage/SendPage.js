import React, {Component,createRef} from 'react'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'
import {Button, FormControl, FormGroup, ListGroup, ListGroupItem, Modal, ControlLabel, Checkbox} from 'react-bootstrap'
import Dropzone from 'react-dropzone'

import {sendMessage} from '../../../actions/sendActionCreators'
import filesize from 'filesize'
import {PageWrapper} from "../PageWrapper";

class SendPage extends Component {

  constructor(props) {
    super(props);

    this.state = this.getInitialState();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.removeAttachment = this.removeAttachment.bind(this);
    this.handleChangeKey = this.handleChangeKey.bind(this);
    this.handleChangeSignKey = this.handleChangeSignKey.bind(this);
    this.handleEncrypt = this.handleEncrypt.bind(this);
    this.handleSigniture = this.handleSigniture.bind(this)
  }

  getInitialState() {
    return {
      to: '',
      subject: '',
      message: '',
      attachments: [],
      dropzoneActive: false,
      dropzoneKeyActive:false,
      showEncrypt:false,
      showSign:false,
      keyValue:"",
      signKey:"",
      sign:""
      
    };
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();
    const {to, subject, message, attachments} = this.state;
    this.props.sendMessage(to, subject, message, attachments);
    this.setState(this.getInitialState())
    this.props.moveToHome();
  }

  onDrop(files) {
    this.setState({dropzoneActive: false});
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          attachments: [
            ...this.state.attachments,
            {
              name: files[i].name,
              size: files[i].size,
              type: files[i].type,
              blob: reader.result
            }
          ]
        })
      };
      reader.readAsBinaryString(files[i]);
    }
  }

  onDropKey(files) {
    this.setState({dropzoneKeyActive: false});
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          keyValue:reader.result
        })
      };
      reader.readAsText(files[i]);
    }
  }

  onDropKeySign(files) {
    this.setState({dropzoneKeyActive: false});
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          signKey:reader.result
        })
      };
      reader.readAsText(files[i]);
    }
  }

  handleEncrypt(){
    
  }

  handleSigniture(){

  }

  removeAttachment(file) {
    this.setState({
      attachments: this.state.attachments.filter(item => item !== file)
    })
  }

  handleChangeKey(e){
    this.setState({keyValue:e.target.value})
  }
  handleChangeSignKey(e){
    this.setState({signKey:e.target.value})
  }
  render() {
    let dropzoneRef;
    const handleClose =()=>this.setState({showEncrypt:false,showSign:false})
    const dropzoneOverlayStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      padding: '2.5em 0',
      background: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      color: '#fff'
    
    };
    

    return (
      <PageWrapper title='Send - Gmail'>
        <FormGroup>
          <Button
            onClick ={()=> this.setState({showEncrypt:true})}
          >
            Encrypt
          </Button>
          <Button
            onClick ={()=> this.setState({showSign:true})}
            style = {{marginLeft:"1vw"}}
          >
            Create Signiture
          </Button>
        </FormGroup>
        
        <form onSubmit={this.onSubmit}>
          <FormGroup>
            <FormControl
              placeholder='Receiver'
              type='email'
              name='to'
              vale={this.state.to}
              onChange={this.onChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              placeholder='Subject'
              name='subject'
              value={this.state.subject}
              onChange={this.onChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Dropzone
              disableClick
              style={{position: "relative"}}
              onDrop={this.onDrop.bind(this)}
              onDragEnter={() => this.setState({dropzoneActive: true})}
              onDragLeave={() => this.setState({dropzoneActive: false})}
              ref={(node) => {
                dropzoneRef = node;
              }}
            >
              {this.state.dropzoneActive && <div style={dropzoneOverlayStyle}>
                Drag and drop files here to attach them to your email ...
              </div>}
              <FormControl
                placeholder='Content'
                name='message'
                value={this.state.message}
                onChange={this.onChange}
                componentClass='textarea'
                rows={10}
                required
              />
            </Dropzone>
          </FormGroup>
          
          <ListGroup>
            {this.state.attachments.map((file, index) => (
              <ListGroupItem key={index} listItem={true}>
                {file.name} ({filesize(file.size)})
                <Button
                  onClick={() => this.removeAttachment(file)}
                  className='btn-link badge close'
                >
                  &times;
                </Button>
              </ListGroupItem>
            ))}
          </ListGroup>

          <FormGroup>
            <Button onClick={() => {
              dropzoneRef.open()
            }}>
              Attach File
            </Button>

            <Button
              className='pull-right'
              bsStyle='primary'
              type='submit'
              disabled={this.props.isLoading}
            >
              Send
            </Button>
          </FormGroup>
        </form>
        <Modal show = {this.state.showEncrypt} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Encryption</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <ControlLabel>
                  Key
              </ControlLabel>
              <FormGroup>  
                <Dropzone
                disableClick
                style={{position: "relative"}}
                onDrop={this.onDropKey.bind(this)}
                onDragEnter={() => this.setState({dropzoneKeyActive: true})}
                onDragLeave={() => this.setState({dropzoneKeyActive: false})}
              >
                {this.state.dropzoneKeyActive && <div style={dropzoneOverlayStyle}>
                  Drag and drop files here to be read
                </div>}
                  <FormControl
                  type="text"
                  value = {this.state.keyValue}
                  placeholder="Enter Key or Drag File"
                  onChange={this.handleChangeKey}
                  />
                </Dropzone> 
              </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleEncrypt}>
              Encrypt
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show = {this.state.showSign} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Signature Creation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>  
              <ControlLabel>
                  Enter Key
              </ControlLabel>
              <Dropzone
                disableClick
                style={{position: "relative"}}
                onDrop={this.onDropKeySign.bind(this)}
                onDragEnter={() => this.setState({dropzoneKeyActive: true})}
                onDragLeave={() => this.setState({dropzoneKeyActive: false})}
              >
                <FormControl
                  type="text"
                  value = {this.state.signKey}
                  placeholder="Enter Key or Drag File"
                  onChange={this.handleChangeSignKey}
                  />
              </Dropzone>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="secondary" onClick={this.handleSigniture}>
              Generate Key
            </Button>
          </Modal.Footer>
        </Modal>
      </PageWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoading: state.send.isLoading
  }),
  dispatch => ({
    sendMessage: (to, subject, message, attachments) => {
      dispatch(sendMessage(to, subject, message, attachments))
    },
    moveToHome: () => {
      dispatch(push('/'))
    }
  })
)(SendPage);
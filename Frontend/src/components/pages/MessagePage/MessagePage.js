import React, {Component} from 'react'
import {connect} from 'react-redux'
import renderHtml from 'react-render-html'
import {Button, ButtonGroup, FormControl, FormGroup, ListGroup, ListGroupItem, Panel,Modal,ControlLabel} from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import filesize from 'filesize'

import {PageWrapper} from '../PageWrapper'
import {downloadAttachment, getMessage} from '../../../actions/messageActionCreators'
import {reply} from '../../../actions/sendActionCreators'
import {getHeader} from '../../../messageMethods'
import MessagePageService from "./MessagePageService"

const messagePage = new MessagePageService()

class MessagePage extends Component {

  constructor(props) {
    super(props);

    this.state = this.getInitialState();
    this.onReplyChange = this.onReplyChange.bind(this);
    this.onSendReply = this.onSendReply.bind(this);
    this.handleChangeKey = this.handleChangeKey.bind(this);
    this.handleChangeSignKey = this.handleChangeSignKey.bind(this);
    this.handleDecrypt = this.handleDecrypt.bind(this)
    this.handleSignature = this.handleSignature.bind(this)
  }

  getInitialState() {
    return {
      reply: '',
      attachments: [],
      dropzoneActive: false,
      dropzoneKeyActive:false,
      showDecrypt:false,
      showSign:false,
      showErrorSign:false,
      keyValue:"",
      signKey:"",
      plaintext:"",
      isSignature:""
    };
  }

  componentWillMount() {
    this.props.getMessage(this.props.match.params.id);
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

  handleDecrypt(){
    var ciphertext = []
    var message = this.props.message.payload.htmlBody.substring(0,this.props.message.payload.htmlBody.length-2)
    var splitMessage = message.split("#################")
    message = splitMessage[0].substring(0,splitMessage[0].length-2)
    ciphertext.push({
      key:this.state.keyValue,
      text:message.replace(/\\u([0-9a-fA-F]{4})/g, (m,cc)=>String.fromCharCode("0x"+cc)),
      mode:"ECB",
      padding:"true"
    })
    const contentdata = ciphertext[0];
    if(this.state.keyValue!=""){
      messagePage.decryptMessage(contentdata).then(response=>{
        const data = response.data;
        this.setState({plaintext:data.plaintext})
      }).catch(error=>{
        console.log(error)
      })
    }
    
    
  }
  handleSignature(){
    var payload =[]
    var message = this.props.message.payload.htmlBody.substring(0,this.props.message.payload.htmlBody.length-2)
    var splitMessage = message.split("#################")
    message = splitMessage[0].substring(0,splitMessage[0].length-2)
    if(splitMessage.length>1){
      var sign = splitMessage[1].split(",")
      var pub_key = this.state.signKey.split(",")
      payload.push({
        pub_x:pub_key[0],
        pub_y:pub_key[1],
        message:message,
        r:sign[0].replace(/\n/g,""),
        s:sign[1].replace("\n","")
      })
      const contentdata = payload[0]
      messagePage.verifySign(contentdata).then(response=>{
        const data = response.data;
        this.setState({isSignature:data.verified})
      })
    }
    else{
      this.setState({showSign:false})
      this.setState({showErrorSign:true})
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

  onReplyChange(e) {
    this.setState({reply: e.target.value})
  }

  onSendReply(e) {
    e.preventDefault();
    const {message} = this.props;
    const {reply, attachments} = this.state;
    this.props.reply(message, reply, attachments);
    this.setState(this.getInitialState());
  }

  render() {
    let dropzoneRef;
    let dropzoneKeyRef;
    let dropzoneSignRef;
    const handleClose =()=>this.setState({showDecrypt:false,showSign:false,showErrorSign:false})
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
      <div>
        {this.props.isLoaded && (
          <PageWrapper title='Message - Gmail'>
            <Panel header={
              <div>
                <span><i>From:</i> {getHeader(this.props.message, 'From')}</span>
                <hr style={{margin: '5px'}}/>
                <span><i>To:</i> {getHeader(this.props.message, 'To')}</span>
                <hr style={{margin: '5px'}}/>
                <span><i>Subject:</i> {getHeader(this.props.message, 'Subject')}</span>
              </div>
            }>
              <span style={{whiteSpace:"pre-line",wordWrap:"break-word"}}>
                {this.props.message.payload.htmlBody === '' ? (
                  <i>Empty Message</i>
                ) : (
                  renderHtml(this.props.message.payload.htmlBody)
                )}
              </span>
              {this.props.message.payload.attachments.length ? (
                  <div>
                    <hr/>
                    <ButtonGroup vertical>
                      {this.props.message.payload.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          onClick={() => this.props.downloadAttachment(this.props.message.id, attachment)}
                        >
                          <i className="fa fa-cloud-download" aria-hidden="true"/> {attachment.filename}
                          ({filesize(attachment.body.size)})
                        </Button>
                      ))}
                    </ButtonGroup>
                  </div>
                ) :
                (
                  null
                )}
            </Panel>
            <form onSubmit={this.onSendReply}>
              <FormGroup>
                <Button
                  onClick ={()=> this.setState({showDecrypt:true})}
                >
                  Decrypt
                </Button>
                <Button
                  onClick ={()=> this.setState({showSign:true})}
                  style = {{marginLeft:"1vw"}}
                >
                  Confirm Signature
                </Button>
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
                    value={this.state.reply}
                    onChange={this.onReplyChange}
                    componentClass='textarea'
                    rows={3}
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


              <Button onClick={() => {
                dropzoneRef.open()
              }}>
                Attach File
              </Button>

              <Button
                type='submit'
                className='pull-right'
                bsStyle='primary'
                style={{marginBottom: '100px'}}
              >
                Send
              </Button>
            </form>

            <Modal show = {this.state.showDecrypt} onHide={handleClose} backdrop="static">
              <Modal.Header closeButton>
                <Modal.Title>Decryption</Modal.Title>
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
                  ref={(node) => {
                    dropzoneKeyRef = node;
                  }}
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
                    <FormControl
                    componentClass='textarea'
                    value = {this.state.plaintext}
                    disabled={true}
                    
                    />
                  </Dropzone>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => {
                    dropzoneKeyRef.open()
                }}>
                  Select file
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleDecrypt}>
                  Decrypt
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show = {this.state.showErrorSign} onHide={handleClose} backdrop="static">
              <Modal.Header closeButton>
                <Modal.Title>Error Signature</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <ControlLabel>
                    SIGNITURE IS FALSE
                  </ControlLabel>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show = {this.state.showSign} onHide={handleClose} backdrop="static">
              <Modal.Header closeButton>
                <Modal.Title>Signature Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FormGroup>
                  <ControlLabel>
                      Is Signature Same
                  </ControlLabel>
                  <Dropzone
                  disableClick
                  style={{position: "relative"}}
                  onDrop={this.onDropKeySign.bind(this)}
                  onDragEnter={() => this.setState({dropzoneKeyActive: true})}
                  onDragLeave={() => this.setState({dropzoneKeyActive: false})}
                  ref={(node) => {
                    dropzoneSignRef = node;
                  }}
                >
                  <FormControl
                    type="text"
                    value = {this.state.signKey}
                    placeholder="Enter Key or Drag File"
                    onChange={this.handleChangeSignKey}
                    />
                  </Dropzone>
                </FormGroup>
                <FormGroup>  
                  <FormControl
                    type="text"
                    value = {this.state.isSignature}
                    disabled="true"
                    />
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
              <Button onClick={() => {
                  dropzoneSignRef.open()
                }}>
                  Select file
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="secondary" onClick={this.handleSignature}>
                  Match
                </Button>
              </Modal.Footer>
            </Modal>
          </PageWrapper>
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    message: state.message.message,
    isLoaded: !!state.message.message
  }),
  dispatch => ({
    getMessage: (id) => {
      dispatch(getMessage(id))
    },
    downloadAttachment: (messageId, attachment) => {
      dispatch(downloadAttachment(messageId, attachment))
    },
    reply: (messageToReply, replyMessage, attachments) => {
      dispatch(reply(messageToReply, replyMessage, attachments));
    }
  })
)(MessagePage);
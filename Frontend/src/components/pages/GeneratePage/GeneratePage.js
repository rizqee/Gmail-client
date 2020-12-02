import React, {Component} from 'react'
import { Button, FormGroup } from 'react-bootstrap'
import {PageWrapper} from "../PageWrapper";
import { connect } from 'react-redux'
import GeneratePageService from './GeneratePageService';

const generatePageService = new GeneratePageService()
class GeneratePage extends Component{
    constructor(props){
        super(props)
        this.state = {
            publicKey:"",
            privateKey:""
        }
        this.handleGenerate = this.handleGenerate.bind(this)
        this.handleDownloadPri = this.handleDownloadPri.bind(this)
        this.handleDownloadPub = this.handleDownloadPub.bind(this)
    }
    handleGenerate(e){
        generatePageService.generateSignKey().then(response=>{
            const data = response.data
            this.setState({
                publicKey:data.pub_x.toString()+","+data.pub_x.toString(),
                privateKey:data.pri.toString()
            })
        }).catch(error=>{
            console.log(error)
          })
    }
    handleDownloadPri(e){
        const { privateKey } = this.state;
        let file = new Blob([privateKey], { type: 'octet/stream' });
        const el = document.createElement('a');
        el.href = URL.createObjectURL(file);
        el.download = "kunci.pri";
    
        document.body.appendChild(el);
        el.click();
    }
    handleDownloadPub(e){
        const { publicKey } = this.state;
        let file = new Blob([publicKey], { type: 'octet/stream' });
        const el = document.createElement('a');
        el.href = URL.createObjectURL(file);
        el.download = "kunci.pub";
    
        document.body.appendChild(el);
        el.click();
    }
    render(){
        return(
            <PageWrapper title='Generate Key'>
                <div>
                    <FormGroup>
                        <Button onClick={this.handleGenerate}>
                            Generate Key
                        </Button>
                        
                    </FormGroup>
                    <FormGroup>
                        <span>public key : {this.state.publicKey}</span>
                    </FormGroup>
                    <FormGroup>
                        <span>private key : {this.state.privateKey}</span>
                    </FormGroup>
                    <FormGroup>
                        <Button onClick={this.handleDownloadPub}>
                            Download Public Key
                        </Button>
                        <Button onClick={this.handleDownloadPri}>
                            Download Private Key
                        </Button>
                    </FormGroup>
                </div>
            </PageWrapper>
        )
    }
}
export default connect()(GeneratePage)
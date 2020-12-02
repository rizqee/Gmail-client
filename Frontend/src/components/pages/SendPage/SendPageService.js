import axios from 'axios';

class SendPageService{
    encryptMessage(data){
        const URL = "http://54.234.179.31.xip.io:3001/traveler/encrypt";
        const payload = data;
        return new Promise((resolve,reject)=>{
            axios.post(URL,payload,{}).then(
                response=>{
                    resolve(response);
                }
            ).catch(error=>{
                reject('ERROR')
            })
        })
    }
    
    generateSign(data){
        const URL = "http://54.234.179.31.xip.io:3001/ecdsa/sign"
        const payload = data
        return new Promise((resolve,reject)=>{
            axios.post(URL,payload,{}).then(
                response=>{
                    resolve(response);
                }
            ).catch(error=>{
                reject('ERROR')
            })
        })
    }
}
export default SendPageService
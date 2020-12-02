import axios from 'axios';

class MessagePageService{
    decryptMessage(data){
        const URL = "http://127.0.0.1:3001/traveler/decrypt";
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
    verifySign(data){
        const URL = "http://127.0.0.1:3001/ecdsa/verify";
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
}
export default MessagePageService
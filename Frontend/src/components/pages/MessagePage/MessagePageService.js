import axios from 'axios';

class MessagePageService{
    decryptMessage(data){
        const URL = "127.0.0.1:3001/traveler/decrypt";
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
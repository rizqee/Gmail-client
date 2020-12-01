import axios from 'axios';

class MessagePageService{
    decryptMessage(data){
        const URL = "localhost:3001/traveler/decrypt";
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
import axios from 'axios';

class SendPageService{
    encryptMessage(data){
        const URL = "localhost:3001/traveler/encrypt";
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
export default SendPageService
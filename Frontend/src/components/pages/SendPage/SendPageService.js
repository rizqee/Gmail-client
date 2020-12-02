import axios from 'axios';

class SendPageService{
    encryptMessage(data){
        const URL = "http://127.0.0.1:3001/traveler/encrypt";
        const payload = data;
        console.log(URL)
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
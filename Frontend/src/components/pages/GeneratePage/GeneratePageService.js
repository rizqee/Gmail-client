import axios from 'axios';

class GeneratePageService{
    generateSignKey(){
        const URL = "http://54.234.179.31.xip.io:3001/ecdsa/key"
        return new Promise((resolve, reject)=>{
            axios.get(URL, {}).then(response=>{
                resolve(response);
            }).catch(error=>{
                reject('ERROR');
            })
        })
    }
}
export default GeneratePageService
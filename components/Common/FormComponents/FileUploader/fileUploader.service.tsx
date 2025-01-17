import axios from 'axios';
import api from '@/services/axios';

export const getS3Url = (base_url: string, endpoint : any, payload : any) => {
    return new Promise((resolve, reject) => {
        return api.post(`${base_url}/${endpoint}`, payload).then(
            (res) => {
                const data = res.data;
                return resolve(data);
            }
        ).catch((error) => {
            return reject(error);
        })
    });
};

export const sendFile = (url : string, file : any, headers : any, onUploadProgress: any) => {
    let cancelTokenSource = axios.CancelToken.source();
    return new Promise((resolve, reject) => {
        if (url.includes(".amazonaws.com")) {
            return axios.put(url, file, {headers: headers, onUploadProgress: (progressEvent)=>{
                    onUploadProgress(progressEvent, cancelTokenSource);
                }, cancelToken : cancelTokenSource.token }).then(
                (res) => {
                    return resolve(res);
                }
            ).catch((error) => {
                return reject(error);
            })
        } else {
            return reject();
        }
    });
};

export const saveImages = (base_url: string, original_name: string, image_name: string) => {
    return new Promise((resolve, reject) => {
        return api.post(`${base_url}/media/s3/upload`, { original_name, path: image_name }).then(
            (res) => {
                const data = res.data;

                return resolve(data);
            }
        ).catch((error) => {
            return reject(error);
        })
    });
};


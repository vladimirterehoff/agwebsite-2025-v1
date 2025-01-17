// Libs
import React, {ChangeEvent, ReactNode, useCallback, useEffect, useState} from 'react';
import {useFormContext} from "react-hook-form";
// Services
import {getS3Url, saveImages, sendFile} from './fileUploader.service';
// Redux
import {Media} from '@/app-redux/COMMON/model/media';
// MUI Components
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
// Components
import Button from '@/components/Common/Button';
// Helpers
import {notify} from "@/helpers/notify";
// Constants
import {API_URL, BACKEND_URL, S3_SERVER} from '@/utils/envirenment';
// Styles
import styles from './style.module.scss';

interface Props {
  title?: string
  name?: string
  media?: Media[]
  required?: boolean
  needRemove?: boolean
  type?: MEDIA_TYPE
  multiple?: boolean
  fileClass?: string
  helperText?: string
  error?: any

  maxCount?: number

  maxSize?: number // in mb
  sizeHelperText?: string

  maxDuration?: number // in sec
  durationHelperText?: string

  uploaderInProgress?: (status: boolean) => void
  addFileCallback?: (files: any) => void
  removeFileCallback?: (file: any) => void
}

interface M extends Media {
  status?: number | string
}

export enum MEDIA_TYPE{
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file'
}

const VIDEO_TYPE = 'video/3gpp,video/x-flv,video/mp4,video/mov';
const IMAGE_TYPE = 'image/jpeg,image/png,image/webp';
const FILE_TYPE = '.pdf,.txt,.doc,.docx,.exel';

class PrevFilesClass {
  files: M[] = [];

  set(files: M[]) {
    this.files = files;
  }
}

/**
 * File Uploader Component
 * @param props
 * @constructor
 */
const FileUploader = (props: Props) => {
  const {
    maxCount = 1,
    maxSize,
    helperText,
    sizeHelperText,
    maxDuration,
    durationHelperText,
    multiple = false,
    needRemove = true,
    name = 'media',
    type = MEDIA_TYPE.IMAGE,
  } = props;

  const BASE_URL = BACKEND_URL;
  const [idInput, setIdInput] = useState('fileUploader');
  const [PrevFiles] = useState(new PrevFilesClass());
  const [prevFiles, setPrevFiles] = useState<M[]>([]);
  const [value, setValue] = useState<any>();
  const { setValue: setFormValue, clearErrors } = useFormContext();

  /**
   * Set default values of the uploader
   */
  useEffect(() => {
    if (props.media) {
      let images = Array.isArray(props.media) ? props.media : [props.media];
      if (images.length > 0 && value === undefined) {
        PrevFiles.set(images);
        setPrevFiles(images);
        setValue(multiple ? images.map((f: any) => f.id) : images[0].id);
      }
    }
  }, [props.media]);

  /**
   * Update Form Media Value
   */
  useEffect(() => {
    if(setFormValue && name) setFormValue(name, value);
  }, [value]);

  /**
   * Set Uploader Input ID
   */
  useEffect(() => {
    if (name) setIdInput(`fileUploader-${name}-${new Date().getTime()}`);
  }, [name]);

  /**
   * Check the upload files in process
   */
  useEffect(() => {
    const fileInProgress = prevFiles.find((f) => typeof f.status == "number" && f.status != 100);
    if (props.uploaderInProgress) props.uploaderInProgress(fileInProgress ? true : false);
  }, [prevFiles]);

  /**
   * Upload File
   */
  const startUploadFile = useCallback(async (event: any) => {
    let array = [];
    let files = event.target.files;

    /**
     * Check count of media files
     */
    if (multiple && files.length && files.length + prevFiles.length > maxCount) {
      files = Object.values(files).slice(0, maxCount - prevFiles.length);
      notify.error(`Max qty of media is ${maxCount}`);
    }

    if (!files.length) {
      clearInputFile();
      return;
    }

    let _prevFiles = [...prevFiles];

    for (let i = 0; i < files.length; i++) {
      const data: any = await processingFile(files[i]);
      if (data) {
        _prevFiles.push(data.preFile);
        array.push(new Promise((resolve, reject) => {
          uploadToS3(data.file, resolve, reject);
        }));
      }
    }

    if (array.length) {
      PrevFiles.set(_prevFiles);
      setPrevFiles(_prevFiles);

      Promise.all(array).then((res: any) => {
        successUpload(res);
      }).catch((e) => {
      })
    }
  }, [prevFiles]);

  /**
   * Validate file and update file object
   * @param file
   */
  const processingFile = (file: any) => {
    return new Promise((resolve, reject) => {

      /**
       * Check size of media file
       */
      if (maxSize) {
        const size = file.size;
        if (size > maxSize * 1000000) {
          notify.error(`${file.name} is too big. ${sizeHelperText}`);
          resolve(null)
        }
      }

      const originName = file.name;

      /**
       * Create unique file name and rename file.
       */
      Object.defineProperty(file, 'name', {
        writable: true,
        value: getUniqueFileName(file)
      });
      //Save original file name in original_name attribute.
      Object.defineProperty(file, 'original_name', {
        writable: true,
        value: originName
      });

      const url = (window.URL || window.webkitURL).createObjectURL(file);

      const preFile = {
        name: file.name,
        url: url,
        original_name: originName,
        status: 2,
        size: file.size
      };

      /**
       * Check duration of video file
       */
      if (file.type.indexOf('video') >= 0 && maxDuration) {
        var video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          var duration = video.duration;
          if (duration > maxDuration) {
            notify.error(`${file.original_name} is too long. ${durationHelperText}`);
            resolve(null)
          } else resolve({file, preFile});
        }
        video.src = url;
      } else resolve({file, preFile});
    })
  }

  /**
   * Upload file to S3 - get S3 Url
   */
  const uploadToS3 = useCallback((file: any, resolve: Function, reject: Function) => {
    let payload = {
      Key: 'tmp/' + file.name,
      ContentType: file.type,
      ContentLength: file.size
    };

    getS3Url(BASE_URL, S3_SERVER, payload).then((res: any) => {
      let url = res['pre-signed-url'];

      Object.defineProperty(file, 'url', {
        writable: true,
        value: url
      });
      const status = setStatus(file.name, 10);
      if (!status) return reject();
      setTimeout(() => uploadFile(file, url, resolve, reject), 300);
    }, (err) => {
      console.log('getS3Url errors', err);
      let errorsList = err?.errors ? err.errors.map((error: any) => error.errors) : err.toString();
      setStatus(file.name, errorsList.join(' '));
      reject();
    })

    if (props.error) {
      clearErrors(name);
    }
  }, [prevFiles]);

  /**
   * Send File to the S3
   * @param file
   * @param url
   * @param resolve
   * @param reject
   */
  const uploadFile = (file: any, url: string, resolve: Function, reject: Function) => {
    let payload = {
      'Content-Type': file.type,
      'Remove-Auth': true
    };

    sendFile(
        url,
        file,
        payload,
        (progressEvent: any, cancelTokenSource: any) => {
          const progress = progressEvent.loaded * 100 / file.size;
          const status = setStatus(file.name, Math.ceil(progress * 80 / 100 + 10));
          if (!status) cancelTokenSource.cancel('');
        })
        .then((res: any) => {
          saveImages(BASE_URL, file.original_name, 'tmp/' + file.name).then((res: any) => {
            setStatus(file.name, 90);
            resolve(res);
          }).catch((err) => {
            console.log('saveImages errors', err);
            let errorsList = err?.errors ? err.errors.map((error: any) => error.errors) : err.toString();
            setStatus(file.name, errorsList.join(' '));
            reject();
          })
        }).catch((err) => {
      console.log('sendFile', err);
      setStatus(file.name, err.toString());
      reject();
    });
  }

  /**
   * Success Upload
   * @param files
   */
  const successUpload = (files: any[]) => {
    clearInputFile();

    let _prevFiles = [...PrevFiles.files];
    files.forEach((file) => {
      for (let i = 0; i < _prevFiles.length; i++) {
        if (file.name == _prevFiles[i].name) _prevFiles[i] = {..._prevFiles[i], ...file, status: 100};
      }
    });
    PrevFiles.set(_prevFiles);
    setPrevFiles(_prevFiles);

    const completeFiles = _prevFiles.filter((f: any) => typeof f.status == "undefined" || f.status == 100);
    const _value =
        multiple ? completeFiles.map((f: any) => f.id) :
            completeFiles.length ? completeFiles[0].id : null;
    if (props.addFileCallback) props.addFileCallback(_value);

    setValue(_value)
  }

  const uploadClickAction = () => {
    const input = document.getElementById(idInput);
    if (input) input.click();
  }

  /**
   * Set Status of upload progress to the file
   * @param name
   * @param status
   */
  const setStatus = (name: string, status: number | string) => {
    let _prevFiles: any[] = [...PrevFiles.files];
    const curFiles = _prevFiles.find((f) => f.name == name);
    if (curFiles) curFiles['status'] = (status == 'AxiosError: Network Error') ? 'Please check your internet connection and Upload again.' : status;
    else return null;

    PrevFiles.set(_prevFiles);
    setPrevFiles(_prevFiles);

    return true;
  };

  /**
   * Create Unique Name for the file
   * @param $file
   */
  const getUniqueFileName = ($file: any) => {
    let $parts = $file.name.split('.');
    return guid() + '.' + $parts[$parts.length - 1];
  }
  const guid = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }

  /**
   * Remove File
   * @param data
   * @param index
   */
  const removeFile = (data: any, index: any) => {
    const _prevFiles = [...prevFiles];
    _prevFiles.splice(index, 1);
    PrevFiles.set(_prevFiles);
    setPrevFiles(_prevFiles);

    const val = multiple ? _prevFiles.map((f: any) => f.id) : null;
    setValue(val);
    if (props.removeFileCallback) props.removeFileCallback(val);
    clearInputFile();
  };

  const clearInputFile = () => {
    const input: any = document.getElementById(idInput);
    if (input) input.value = null;
  }

  /**
   * Clear state when unmounting
   */
  useEffect(() => {
    return () => {
      setPrevFiles([]);
      setValue(undefined);
      if(setFormValue && name) {
        setFormValue(name, undefined);
      }
      PrevFiles.set([]);
    };
  }, []);

  return (
      <div className={`${styles.fileUploader}`}>
        <div className={`${styles.fileUploader_list}`}>
          {prevFiles.map((e, index) => {
            return (
                <div
                    key={index}
                    className={`${styles.fileUploader_block}`}
                >
                  <div className={`${styles.fileUploader_block_top}`}>
                    <div>
                      {e.original_name}
                    </div>

                    {needRemove &&
                        <IconButton onClick={() => removeFile(e, index)}
                                    size={'small'}>
                          <CloseIcon />
                        </IconButton>
                    }
                  </div>

                  { (type == MEDIA_TYPE.IMAGE || type == MEDIA_TYPE.VIDEO) &&
                      <div className={styles.fileUploader_block_image}>
                        {type == MEDIA_TYPE.IMAGE &&
                            <a className={`${styles.fileUploader_image} ${props.fileClass || ''}`}
                                style={{backgroundImage: `url(${e.url}`}} href={e.url} target="_blank">
                            </a>
                        }

                        {type == MEDIA_TYPE.VIDEO &&
                            <video src={`${e.url}#t=0`} controls={false} muted preload={'metadata'}/>
                        }

                        {(typeof e.status == "string") && (
                            <div className={styles.image_error}/>
                        )}
                      </div>
                  }

                  {(typeof e.status == "number" && e.status != 100) &&
                      <div className={`${styles.loaderBlock}`}>
                        {e.status}% Loading
                        <div className={styles.progressBar}>
                          <div style={{width: `${e.status}%`}}/>
                        </div>
                      </div>
                  }

                 {/* {e.status == 100 && (
                      <div className={`${styles.loaderSuccess}`}>
                         100% <img src={'/image/check.svg'} alt={''}/>
                      </div>
                  )}*/}

                  {(typeof e.status == "string") && (
                      <div className={styles.uploadError} dangerouslySetInnerHTML={{__html: e.status}}/>
                  )}
                </div>
            )
          })}
        </div>

        <div
            className={`${styles.fileUploader_container}`}
            onClick={uploadClickAction}
        >
          {prevFiles.length < maxCount && (
              <>
                <div className={`${styles.fileUploader_button}`}>
                  <div className={styles.fileUploader_button_image}>
                    <UploadIcon color={'primary'}/>
                  </div>
                  <div>
                    {props.title ? props.title : `Upload ${
                        props.type == MEDIA_TYPE.VIDEO ? 'Video' :
                        props.type == MEDIA_TYPE.IMAGE ? 'Image' : "File"
                    }`}{props.required ? '*' : ''}
                    {maxCount > 1 &&
                        <span className={styles.maxCountHelperText}>
                        Up to {maxCount - prevFiles.length} {props.title} can be added
                      </span>
                    }
                    {helperText && <span dangerouslySetInnerHTML={{__html: helperText}}/>}
                    {sizeHelperText && <span dangerouslySetInnerHTML={{__html: sizeHelperText}}/>}
                    {durationHelperText && <span dangerouslySetInnerHTML={{__html: durationHelperText}}/>}
                  </div>
                </div>

                <input
                    type="file"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => startUploadFile(e)}
                    id={idInput}
                    className={styles.fileUploader_input}
                    accept={
                        props.type == MEDIA_TYPE.VIDEO ? VIDEO_TYPE :
                        props.type == MEDIA_TYPE.IMAGE ? IMAGE_TYPE : FILE_TYPE
                    }
                    multiple={multiple}
                />
              </>
          )}
        </div>


        {props.error && <FormHelperText error={true}>{props.error}</FormHelperText>}
      </div>
  )
};

export default FileUploader;

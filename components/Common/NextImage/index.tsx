// Libs
import React, {useState} from 'react';
import Image, {ImageProps} from 'next/image'
// Redux
import {Media} from "@/app-redux/COMMON/model/media";

type SimpleSize = [number, number];

interface Props  extends  ImageProps{
  path: Media | string;
  size?: SimpleSize;
  crop?: boolean;
}

/**
 * Next Image Component
 * @param props
 * @constructor
 */
const NextImage = (props: Props) => {
  const { crop = false, size, path= '', ...imageProps } = props;

  const getImageParams = (): string => {
    let pathString :string;
    if(typeof path == 'string') pathString = path;
    else{
      pathString= crop ? path['crop_url'] : path['resize_url'];
      const isHaveParams = pathString.indexOf('?')>=0;
      if(size){
        const params = (isHaveParams ? '&' : '?') + `w=${size[0]}&h=${size[1]}`;
        pathString =  pathString + params;
      }
    }
    return pathString;
  };

  const _imageProps : ImageProps= {
    ...imageProps,
    src: getImageParams(),
    objectFit: 'contain'
  }

  return (
    <>
      {path && (
        <Image
          {..._imageProps}
        />
      )}
    </>
  );
};

export default NextImage;

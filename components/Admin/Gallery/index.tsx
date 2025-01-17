import React from 'react';
import ImageGallery from 'react-image-gallery';

export interface Media {
  created_at: number;
  id: number;
  media_type: string;
  name: string;
  original_name: string;
  path: string;
  updated_at: number;
  url: string;
  user_id: number;
  crop_url: string;
  disk: string;
  resize_url: string;
}

interface GalleryProps {
  items: Media[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  const images = items.map((item) => ({
    original: item.url,
    thumbnail: item.url,
    originalAlt: item.name,
    thumbnailAlt: item.name,
  }));

  if (!images.length) {
    return null;
  }

  return <ImageGallery items={images} />;
};

export default Gallery;

import Image from 'next/image';
import dragDrop from '@/styles/upload/drag_drop.module.scss';
import { DragEvent, RefObject, useRef } from 'react';
import { FIXED_IMAGE_HEIGHT, FIXED_IMAGE_WIDTH } from '@/consts';

interface Props {
  imgURL: string;
  imgRef: RefObject<HTMLImageElement>;
  handleSaveImg: (file: File) => void;
}

const DragDrop = ({ imgURL, imgRef, handleSaveImg }: Props) => {
  const dragRef = useRef<HTMLLabelElement>(null);

  const drop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleSaveImg(file);
  };

  const dragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <section className={dragDrop['drag-drop']}>
      <label htmlFor="upload_file_input" ref={dragRef} onDragOver={dragOver} onDrop={drop} tabIndex={0}>
        {!imgURL ? (
          <div className={dragDrop['alt']} />
        ) : (
          <div>
            <Image
              src={imgURL}
              ref={imgRef}
              width={FIXED_IMAGE_WIDTH}
              height={FIXED_IMAGE_HEIGHT}
              alt="preview_image"
            />
          </div>
        )}
      </label>
    </section>
  );
};

export default DragDrop;

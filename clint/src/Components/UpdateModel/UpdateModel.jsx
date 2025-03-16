import { Modal } from '@mantine/core';
import './UpdateModel.css'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserDetails } from '../../Features/homeSlice';

function UpdateModel({updateModel, setUpdateModel, data, setIsMenuOpen}) {

  const dispatch = useDispatch();

  const [title, setTitle] = useState(data.title);
  const [image, setImage] = useState(data.postImage);
  const [imagePreview, setImagePreview] = useState(null);
  const [update, setUpdate] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if(window.innerWidth < 1024)
      setIsMobile(true);
  }, [])

  const handaleSubmit = async (e) => {
    e.preventDefault();
    
    setUpdate(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('postImage', image);

    const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/post/${data._id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    const responceData = await responce.json();

    if(responceData.success === false || responceData.success === 'false'){
      setImage(null);
      setUpdateModel(false);
      setImagePreview(null);
      setIsMenuOpen(false);
      setUpdate(false);
      return alert(responceData.message);
    }

    setImage(null);
    setUpdateModel(false);
    setImagePreview(null);
    setIsMenuOpen(false);
    setUpdate(false);
    
    dispatch(getUserDetails(sessionStorage.getItem('id')));
  }

  return (
    <>
      <Modal
        opened={updateModel}
        onClose={() => setUpdateModel(false)}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size={`${isMobile ? "100%" : "50%"}`}
      >
        <form 
          onSubmit={handaleSubmit}
          action="" 
          className='update-model-form'
        >
          <input 
            type="text" 
            name="title" 
            placeholder='Update post title...'
            id="" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input 
            type="file" 
            name="image" 
            accept="image/*"
            id="" 
            onChange={(e) => {
              setImage(e.target.files[0]);
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {
            imagePreview &&
            <div className='image-preview'>
              <img src={imagePreview} alt="" />
              <button onClick={() => setImagePreview(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          }
          <button
            type='submit'
            className='button'
          >
            {
              update ? "Updating..." : "Update"
            }
          </button>
        </form>
      </Modal>
    </>
  );
}

export default UpdateModel;


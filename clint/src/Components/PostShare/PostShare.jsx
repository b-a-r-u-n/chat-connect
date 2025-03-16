import React, { useRef, useState } from 'react'
import './PostShare.css'
// import img from '../../img/profileImg.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../Features/homeSlice.js'

const PostShare = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.home.user);

    const [postImage, setPostImage] = useState("");
    const [postImagePreview, setPostImagePreview] = useState("");
    const [title, setTitle] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const imageRef = useRef();

    const onImageChange = (e) => {
        if(e.target.files && e.target.files[0]){
            setPostImage(e.target.files[0]);
            setPostImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    }

    const handaleShare = async () => {
        // console.log(postImage);
        
        if(!postImage)
            return alert("Please select an image");

        const formData = new FormData();
        formData.append("postImage",postImage);
        formData.append("title",title);

        setIsUploading(true);

        const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/post`, {
            method: 'POST',
            credentials: 'include',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            body: formData
        })
        const data = await responce.json();
        console.log(data);
        if(data.success === "false" || data.success === false ){
            setIsUploading(false);
            setPostImagePreview("");
            setTitle("");
            setPostImage("");
            return alert(data.message);
        }

        setIsUploading(false);

        alert(data.message);
        
        setPostImagePreview("");
        setTitle("");
        setPostImage("");
        dispatch(getUserDetails(sessionStorage.getItem('id')));
    }

  return (
    <div className='post-share'>
      <div className='post-share-container'>
        <img src={user?.profileImage} alt="" />
        <div>
            <input 
                type="text" 
                placeholder="What's happening ?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="post-options">
                <button className="options photo"
                    onClick={() => imageRef.current.click()}
                >
                    <i className="fa-regular fa-image"></i>
                    <span> Photo</span>
                </button>
                <button className="options video">
                    <i className="fa-solid fa-video"></i>
                    <span> Video</span>
                </button>
                <button className="options location">
                    <i className="fa-solid fa-location-dot"></i>
                    <span> Location</span>
                </button>
                <button className="options shedule">
                    <i className="fa-solid fa-calendar-days"></i>
                    <span> Shedule</span>
                </button>
                <button className="button share-button"
                    onClick={handaleShare}
                >
                    {
                        isUploading ? "Uploading..." : "Share"
                    }
                </button>
                <input 
                    type="file" 
                    accept="image/*"
                    name="image" 
                    id="" 
                    ref={imageRef}
                    onChange={onImageChange}
                    style={{display: "none"}}
                />
            </div>
        </div>
      </div>
      {/* This part of the code is a conditional rendering in JSX. It checks if the `image` state has a
      value (meaning an image has been selected by the user). If `image` has a value, it renders a
      `div` with the class name 'preview-image' containing a button and an image tag displaying the
      selected image. */}
      {
        postImagePreview ? 
        <div className='preview-image'>
            <button
                onClick={() => {
                    setPostImagePreview("");
                    setPostImage("");
                }}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
            <img src={`${postImagePreview}`} alt="" />
        </div>
        :
        ""
      }
    </div>
  )
}

export default PostShare

import React, { useState } from 'react'
import './Post.css'
import like from '../../img/like.png';
import comment from '../../img/comment.png';
import notlike from '../../img/notlike.png';
import share from '../../img/share.png';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../Features/homeSlice';
import DeleteModel from '../DeleteModel/DeleteModel';
import UpdateModel from '../UpdateModel/UpdateModel';


const Post = ({data}) => {

  const dispatch = useDispatch();

  const profilePage = useSelector(state => state.home.profilePage);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [updateModel, setUpdateModel] = useState(false);

  const handaleLike = async (id) => {
    const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/post/${id}/like`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = await responce.json();
    // console.log(data);
    if(data.success === false || data.success === 'false')
      return alert(data.message);
    dispatch(getUserDetails(sessionStorage.getItem('id')))
  }

  // console.log(data);
  

  return (
    <>
      <div className="post">
        <div>
          {/* <img src={data?.profileImage} alt="" /> */}
          <p className="description">
            {data.title}
          </p>
        </div>
        <img src={`${data.postImage}`} alt="" />
        <div className="post-button">
          <div className="post-reaction">
            <button
              onClick={() => handaleLike(data._id)}
            >
              <img src={data.isLiked ? like : notlike} alt="" />
            </button>
            <button>
              <img src={`${comment}`} alt="" />
            </button>
            <button>
              <img src={`${share}`} alt="" />
            </button>
          </div>
          {
            profilePage && 
            <div className='three-dots'>
              <button onClick={() => setIsMenuOpen(prev => !prev)}>
                {
                  isMenuOpen ?  "" : <i className="fa-solid fa-ellipsis-vertical"></i>
                }
              </button>
              {
                isMenuOpen &&
                <div>
                  <button onClick={() => setUpdateModel(true)}>
                    Update
                  </button>
                  <button onClick={() => setDeleteModel(true)}>
                    Delete
                  </button>
                  <button className="cross-btn" onClick={() => setIsMenuOpen(prev => !prev)}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>        
                  <DeleteModel 
                    deleteModel={deleteModel} 
                    setDeleteModel={setDeleteModel}
                    id={data._id}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                  <UpdateModel 
                    updateModel={updateModel}
                    setUpdateModel={setUpdateModel}
                    data={data}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                </div>
              }
            </div>
          }
        </div>
        <div className="post-info">
          <p className="likes">{data.likes?.length} likes</p>
        </div>
      </div>
    </>
  )
}

export default Post

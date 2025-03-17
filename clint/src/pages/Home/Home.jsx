import React, { useEffect, useState } from 'react'
import './Home.css'
import { PostSide, ProfileSide, RightSide } from '../../Components'
// import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, toggleProfileCardVisible, toggleProfilePage } from '../../Features/homeSlice';
import { toggleAnotherUserPage, toggleAnotherUserProfile } from '../../Features/anotherUsersSlice';
import { toggleChatPage } from '../../Features/chatSlice';
import { Error, Loading } from './Components';

const Home = () => {

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.home.isLoading);
  const isError = useSelector(state => state.home.isError);

  
  useEffect(() => {
    const userId = sessionStorage.getItem('id');
    if(userId)
      dispatch(getUserDetails(userId));
    // dispatch(getUserDetails(sessionStorage.getItem('id')));
    dispatch(toggleProfilePage(false));
    dispatch(toggleAnotherUserPage(false));
    dispatch(toggleAnotherUserProfile(false));
    dispatch(toggleChatPage(false));
    if(window.innerWidth < 1024)
      dispatch(toggleProfileCardVisible(false));
  },[])
  
  return (
    <>
      {
        isLoading ? 
        <Loading /> 
        : 
        (
          isError ? 
          <Error /> 
          :
          <div
            className='home'
          >
            <ProfileSide />
            <PostSide />
            <RightSide />
          </div>
        )
      }
    </>
  )
}

export default Home
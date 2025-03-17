import React, { useEffect } from 'react'
import './Profile.css'
import { Error, InfoCard, Loading, LogoSearch, ProfileCard, ProfileCenter, ProfileLeft, RightSide } from '../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, toggleProfilePage, toggleRightSideVisible } from '../../Features/homeSlice'

const Profile = () => {

  const dispatch = useDispatch();
  const rightSideVisible = useSelector(state => state.home.rightSideVisible);

  const isLoading = useSelector(state => state.home.isLoading);
  const isError = useSelector(state => state.home.isError);

  useEffect(() => {
    dispatch(toggleProfilePage(true));
    dispatch(getUserDetails(sessionStorage.getItem('id')));

    if(window.innerWidth < 1024)
      dispatch(toggleRightSideVisible(false));
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
            <div className="profile">
              <div>
                <LogoSearch />
                <ProfileCard />
                <InfoCard />
              </div>
              <ProfileCenter />
              {
                rightSideVisible && <RightSide />
              }
            </div>
          )
        }
    </>
  )
}

export default Profile

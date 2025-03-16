import React, { useState, useEffect } from 'react'
import './ProfileLeft.css'
import LogoSearch from '../LogoSearch/LogoSearch'
import InfoCard from '../InfoCard/InfoCard'
import FollowersCard from '../FollowersCard/FollowersCard'


const ProfileLeft = () => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  return (
    <>
      <div className="profile-left">
        <LogoSearch />
        {/* {
          isMobile && <InfoCard />
        } */}
        <InfoCard />
        <FollowersCard />
      </div>
    </>
  )
}

export default ProfileLeft

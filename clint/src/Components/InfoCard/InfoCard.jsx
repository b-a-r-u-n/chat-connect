import React, {useEffect, useState} from 'react'
import './InfoCard.css'
import ProfileModel from '../ProfileModel/ProfileModel'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const InfoCard = () => {

    const user = useSelector(state => state.home.user);
    

    const [modelOpened, setModelOpened] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(window.innerWidth < 1024)
        setIsMobile(true);
    }, [])


    const handaleLogout = async () => {
        const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await responce.json();
        
        if(data.success === 'false' || data.success === false)
            return alert(data.message);

        navigate("/");
    }

  return (
    <>
        <div className="info-card">
            <div className="info-head">
                <h2>Your Info</h2>
                {/* <button
                    onClick={() => setModelOpened(true)}
                >
                    <i className="fa-solid fa-pencil"></i>
                </button> */}
                {
                    user?._id === sessionStorage.getItem('id') || sessionStorage.getItem('isAdmin') ? 
                    <button
                        onClick={() => setModelOpened(true)}
                    >
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                    : ""
                }
                <ProfileModel 
                    modelOpened={modelOpened} 
                    setModelOpened={setModelOpened}
                    isMobile={isMobile}
                />
            </div>
            <div className="info-details">
                <div className="info">
                    <p>Relationship Status:</p>
                    <span>{user?.relationship}</span>
                </div>
                <div className="info">
                    <p>Lives in:</p>
                    <span>{user?.livesIn}</span>
                </div>
                <div className="info">
                    <p>Works at:</p>
                    <span>{user?.worksAt}</span>
                </div>
                <div className="info">
                    <p>country:</p>
                    <span>{user?.country}</span>
                </div>
            </div>
            <div className="logout-btn">
                {/* <button className="button">
                    Logout
                </button> */}
                {
                    user?._id === sessionStorage.getItem('id') ? 
                    <button className="button" onClick={handaleLogout}>
                        Logout
                    </button>
                    : ""
                }
            </div>
        </div>
    </>
  )
}

export default InfoCard

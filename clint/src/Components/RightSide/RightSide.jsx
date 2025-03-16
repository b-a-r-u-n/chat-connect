import React, { useState } from 'react'
import {NavLink} from 'react-router-dom'
import './RightSide.css'
import TrendCard from '../TrendCard/TrendCard'
import ShareModel from '../ShareModel/ShareModel'

const RightSide = () => {

  const [modelOpened, setModelOpened] = useState(false);

  return (
    <>
      <div className="rightside">
        <div className="icons">
            <button>
              <NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}>
                <i className="fa-solid fa-house"></i>
              </NavLink>
            </button>
            <button>
              <NavLink to="/profile" className={({isActive}) => isActive ? "active-link" : ""}>
                <i className="fa-solid fa-user"></i>
              </NavLink>
            </button>
            <button>
              <NavLink to="/chat" className={({isActive}) => isActive ? "active-link" : ""}>
                <i className="fa-solid fa-comment"></i>
              </NavLink>
            </button>
            <button>
                <i className="fa-solid fa-gear"></i>
            </button>
        </div>
        <TrendCard />
        <div className="btn-container">
            <button 
              className="button share-btn"
              onClick={() => setModelOpened(true)}
            >
              Share
            </button>
            <ShareModel modelOpened={modelOpened} setModelOpened={setModelOpened}/>
        </div>
      </div>
    </>
  )
}

export default RightSide

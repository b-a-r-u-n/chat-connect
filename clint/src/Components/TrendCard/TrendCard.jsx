import React from 'react'
import './TrendCard.css'
import { TrendData } from '../../Data/Data'
import { nanoid } from '@reduxjs/toolkit'

const TrendCard = () => {
  return (
    <>
        <div className="trend-card">
            <h2>Trends for your</h2>
            {
                TrendData.map((data) => {
                    return(
                        <div className='tags' key={nanoid()}>
                            <h4>#{data.name}</h4>
                            <h5>{data.shares}K sheres</h5>
                        </div>
                    )
                })
            }
        </div>
    </>
  )
}

export default TrendCard

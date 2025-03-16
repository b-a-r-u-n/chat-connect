import React, {useState} from 'react'
import './Auth.css'
import logo from '../../img/logo.png'
import { Login, SignUp } from '../../Components';
import { useSelector } from 'react-redux';

const Auth = () => {
    
    const isSignup = useSelector(state => state.home.isSignup);

  return (
    <>
        <div className="auth">
            <div className="auth-left-side">
                <img src={logo} alt="" />
                <div>
                    <h1>ChatConnect</h1>
                    <p>Explore the ideas throughout the world</p>
                </div>
            </div>
            <div className="auth-right-side">
                {
                    isSignup ? <SignUp /> : <Login />
                }
            </div>
        </div>
    </>
  )
}

// const Signup = () => {
//     return(
//         <form action="" className='signup'>
//             <h1>Sign Up</h1>
//             <div className='input-field'>
//                 <div className="full-name">
//                     <input 
//                         type="text" 
//                         placeholder='Fist Name'
//                     />
//                     <input 
//                         type="text"
//                         placeholder='Last Name'
//                     />
//                 </div>
//                 <div className="user-name">
//                     <input 
//                         type="text" 
//                         placeholder='Username'
//                     />
//                 </div>
//                 <div className="pass">
//                     <input 
//                         type="password" 
//                         name="Password" 
//                         placeholder='Password' 
//                     />
//                     <input 
//                         type="confirm-password" 
//                         name="Confirm-Password" 
//                         placeholder='Confirm Password' 
//                     />
//                 </div>
//             </div>
//             <div className='bottom'>
//                 <p>
//                     Already have an account? <span>Login</span>
//                 </p>
//                 <button className='button'>
//                     Sign Up
//                 </button>
//             </div>
//         </form>
//     )
// }

// const Login = () => {
//     return(
//         <form action="" className='signup'>
//             <h1>Log In</h1>
//             <div className='input-field'>
//                 <div className="user-name">
//                     <input 
//                         type="text" 
//                         placeholder='Username'
//                     />
//                 </div>
//                 <div className="user-name">
//                     <input 
//                         type="password" 
//                         name="Password" 
//                         placeholder='Password' 
//                     />
//                 </div>
//             </div>
//             <div className='bottom'>
//                 <p>
//                     Don't have an account? <span>Signup</span>
//                 </p>
//                 <button className='button'>
//                     Log In
//                 </button>
//             </div>
//         </form>
//     )
// }

export default Auth

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { toggleSignup } from '../../Features/homeSlice';
import { Eye, EyeClosed } from 'lucide-react';

const SignUp = () => {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handaleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        setError(null);
    }

    const handaleSubmit = async (e) => {
        e.preventDefault();
        
        if(formData.password.length < 6){
            setError('Password must be at least 6 characters long');
            return;
        }
        if(formData.password !== formData.confirmPassword){
            setError('*Password and Confirm Password does not match');
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const data = await response.json();

        if(data.success === true){
            alert(data.message);
            dispatch(toggleSignup());
        }else{
            alert(data.message);
        }
        
        setFormData({
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: ''
        })
    }

    return(
        <form action="" className='signup' onSubmit={handaleSubmit}>
            <h1>Sign Up</h1>
            <div className='input-field'>
                <div className="full-name">
                    <input 
                        name='firstName'
                        type="text"
                        placeholder='Fist Name'
                        onChange={handaleChange}
                        value={formData.firstName}
                    />
                    <input 
                        name='lastName'
                        type="text"
                        placeholder='Last Name'
                        onChange={handaleChange}
                        value={formData.lastName}
                    />
                </div>
                <div className="user-name">
                    <input 
                        name='userName'
                        type="text" 
                        placeholder='Username'
                        onChange={handaleChange}
                        value={formData.userName}
                    />
                </div>
                <div className="user-name">
                    <input 
                        name='email'
                        type="email" 
                        placeholder='email'
                        onChange={handaleChange}
                        value={formData.email}
                    />
                </div>
                <div className="pass">
                    <div className="left-pass">
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            placeholder='Password' 
                            onChange={handaleChange}
                            value={formData.password}
                        />
                        <button onClick={() => setShowPassword(!showPassword)} type='button'>
                            {
                                showPassword ? <Eye /> : <EyeClosed />
                            }
                        </button>
                    </div>
                    <div className="right-pass">
                        <input 
                            type={showConfirmPassword ? "text" : "password" }
                            name="confirmPassword" 
                            placeholder='Confirm Password' 
                            onChange={handaleChange}
                            value={formData.confirmPassword}
                        />
                        <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} type='button'>
                            {
                                showConfirmPassword ? <Eye/> : <EyeClosed />
                            }
                        </button>
                    </div>
                </div>
            </div>
            {
                error && <p>{error}</p>
            }
            <div className='bottom'>
                <p>
                    Already have an account? 
                    <span>
                        <Link 
                            to="/auth" 
                            onClick={() => dispatch(toggleSignup())}
                        >
                            Login
                        </Link>
                    </span>
                </p>
                <button className='button'>
                    Sign Up
                </button>
            </div>
        </form>
    )
}

export default SignUp

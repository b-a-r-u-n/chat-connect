import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toggleSignup } from '../../Features/homeSlice';
import { Eye, EyeClosed } from 'lucide-react';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);

    const handaleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handaleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json();
        // console.log(data.data.user._id);
        
        if(data.success === false || data.success === 'false'){
            alert(data?.message);
            setFormData({
                email: '',
                password: ''
            })
            return;
        }

        sessionStorage.setItem('id', data?.data?.user?._id);
        sessionStorage.setItem('isAdmin', data?.data?.user?.isAdmin);

        alert(data?.message);
        navigate('/home');
        setFormData({
            email: '',
            password: ''
        })
    }

    return(
        <form action="" className='signup' onSubmit={handaleSubmit}>
            <h1>Log In</h1>
            <div className='input-field'>
                <div className="user-name">
                    <input 
                        name='email'
                        type="email" 
                        placeholder='Email'
                        onChange={handaleChange}
                        value={formData.email}
                    />
                </div>
                <div className="user-name password">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        placeholder='Password' 
                        onChange={handaleChange}
                        value={formData.password}
                    />
                    <button type='button' onClick={() => setShowPassword(!showPassword)}>
                        {
                            showPassword ? <Eye /> : <EyeClosed />
                        }
                    </button>
                </div>
            </div>
            <div className='bottom'>
                <p>
                    Don't have an account? 
                    <span>
                    <Link 
                        to="/auth" 
                        onClick={() => dispatch(toggleSignup())}
                        >
                            Signup
                    </Link>
                            </span>
                </p>
                <button className='button' type='submit'>
                    Log In
                </button>
            </div>
        </form>
    )
}

export default Login
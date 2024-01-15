import { useLocalStorage } from '@uidotdev/usehooks';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/style/style.css';
import logo from '../../assets/images/big_logo.png';


function Login() {
  const navigate = useNavigate()
  const [logged_in_user, setlogged_in_user] = useLocalStorage("user")
  const [data, setData] = useState({})
  
  useEffect(() => {
    if(logged_in_user?.id){
      navigate('/')
    }
  })

  const handleLogin = e => {
    e.preventDefault()
    const elements = e.target.elements

    setData({
      action: 'login',
      email: elements['email'].value,
      password: elements['password'].value
    })
  }

  useEffect(() => {
    if(data?.action == "login"){
      axios.post('http://localhost/game-vault/api/v1.php', data)
      .then(resp => {
        if(resp.data.status === 1){
          navigate('/')
          setlogged_in_user(resp.data)
        } else if (resp.data.status === 0){
          alert(resp.data.msg)
        }
      })
      .catch(error => alert(error))
    }
  }, [data])

  return (
    <div id='login' className='d-flex align-items-center' style={{height: "100vh"}}>
      <Form onSubmit={handleLogin} className='border border-dark-subtle rounded p-5 w-25' style={{margin: "0 0 0 20%"}}>
        <div className='d-flex justify-content-center pb-4 pt-2'>
          <img src={logo} alt='Logo' style={{width : '50%'}} />
        </div>
        <Form.Group className="py-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter email" />
        </Form.Group>
  
        <Form.Group className="pb-3 pt-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name='password' placeholder="Password" />
        </Form.Group>

        <Form.Group className="py-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember Me" />
        </Form.Group>

        <div className='d-flex justify-content-between align-items-center pb-4 pt-2'>
            <Button variant="outline-light" type="submit">Submit</Button>
            <div id='text'>
              Don't have an account?
              <Link  to="/register">Register</Link>
            </div>
        </div>
        </Form>
    </div>
  )
}

export default Login
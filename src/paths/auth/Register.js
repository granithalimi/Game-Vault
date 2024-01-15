import { useLocalStorage } from '@uidotdev/usehooks';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/style/style.css';
import logo from '../../assets/images/big_logo.png';

function Register() {
  const navigate = useNavigate()
  const [logged_in_user, setlogged_in_user] = useLocalStorage("user")
  const [user, setUser] = useState({})

  useEffect(() => {
    if(logged_in_user?.id){
      navigate('/')
    }
  })

  const handleSubmit = e =>{
    e.preventDefault()
    const elements = e.target.elements

    setUser({
      action: "register",
      name: elements['name'].value, 
      surname: elements['surname'].value,
      username: elements['username'].value,
      email: elements['email'].value, 
      password: elements['password'].value
    })
  }

  useEffect(()=>{
    if(user?.action == "register"){
      axios.post('http://localhost/game-vault/api/v1.php', user)
      .then(resp => {
        if(resp.data.status === 1){
          navigate('/login')
        } else if (resp.data.status === 0) {
          alert(resp.data.msg)
        }
      })
      .catch(e => console.log(e))
    }
  }, [user])
  
  return (
    <div id='register' className='d-flex align-items-center' style={{height: "100vh"}}>
      <Form onSubmit={handleSubmit} className='border border-dark-subtle rounded p-5 w-25' style={{margin: "0 0 0 20%"}}>
        <div className='d-flex justify-content-center pb-3'>
          <img src={logo} alt='Logo' style={{width : '50%'}} />
        </div>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Enter Name</Form.Label>
          <Form.Control type="text" name='name' placeholder="Name" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="surname">
          <Form.Label>Enter Surname</Form.Label>
          <Form.Control type="text" name='surname' placeholder="Surname" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Enter Username</Form.Label>
          <Form.Control type="text" name='username' placeholder="Username" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name='email' placeholder="Email" />
        </Form.Group>

        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Enter Password</Form.Label>
          <Form.Control type="password" name='password' placeholder="Password" />
        </Form.Group>

        <div className='d-flex justify-content-between align-items-center'>
          <Button variant="outline-light" type="submit">Register</Button>
          <div id='text'>
            Already have an account?
            <Link to="/login">Login</Link>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default Register
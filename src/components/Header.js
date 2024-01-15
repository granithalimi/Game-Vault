import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/images/sm-logo.png";
import "../assets/style/style.css";
import { useLocalStorage } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const [logged_in_user, setLogged_in_user] = useLocalStorage("user")
  const navigate = useNavigate()
  const [trades, set_trades] = useState([])

  useEffect(() => {
    axios.get(`http://localhost/game-vault/api/v1.php?action=check_trades&receiver_id=${logged_in_user.id}`)
    .then(resp => {
        if(resp.data.status === 1){
            set_trades(resp.data.trades)
        }
    })
    .catch(e => console.log(e))
  }, [trades])
  
  return (
    <Navbar id='header' data-bs-theme="dark">
      <Container  className='d-flex justify-content-between'>
        <Nav className='d-flex justify-content-start w-25'>
          <Nav.Link className='links' href="/all_games">All Games</Nav.Link>
        </Nav>

        <Navbar.Brand href="/" className='d-flex justify-content-center'>
          <img src={logo} width="50" height="50" className="d-inline-block align-top" alt="React Bootstrap logo"/>
        </Navbar.Brand>

        <Nav className='d-flex justify-content-end align-items-center w-25'>
          <Nav.Link className='links' href="/notifications">
            <span id='icons' className='mx-1 position-relative'><i class="bi bi-bell">{(trades && trades.length > 0) ?  <span class="position-absolute bottom-50 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span> : ''}</i></span>
          </Nav.Link>
          <Nav.Link className='links' href="/my_friends"><span id='icons' className='mx-1'><i class="bi bi-people"></i></span></Nav.Link>
          <Nav.Link className='links' href="/my_profile"><span id='icons' className='mx-1'><i className="bi bi-person-circle"></i></span></Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header
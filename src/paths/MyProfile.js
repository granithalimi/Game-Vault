import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { useLocalStorage } from '@uidotdev/usehooks'
import Table from 'react-bootstrap/Table';
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

function MyProfile() {
  const [logged_in_user, setLogged_in_user] = useLocalStorage("user")
  const navigate = useNavigate()
  const [user, setUser] = useState([])
  const [myGames, setMyGames] = useState([])

  useEffect(() => {
    if(!logged_in_user?.token){
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    axios.get(`http://localhost/game-vault/api/v1.php?action=get_user&id=${logged_in_user.id}`)
    .then(resp => {
      if(resp.data.status === 1){
        setUser(resp.data.users)
      }
    })
    .catch(e => console.log(e))
  }, [user])

  useEffect(() => {
    axios.get(`http://localhost/game-vault/api/v1.php?action=get_my_games&user_id=${logged_in_user.id}`)
    .then(resp => {
      if(resp.data.status === 1){
        setMyGames(resp.data.game)
      }
    })
    .catch(e => console.log(e))
  }, [myGames])

  const handleLogout = e => {
    localStorage.removeItem("user")
    navigate('/login')
  }

  return (
    <div id='profile' className='bg-dark'>
        <Header />
          <div className='container'>
            <div className='d-flex'>
              <div className='w-50 d-flex flex-column align-items-center my-5'>
                <h2 className='my-5' style={{color: 'white'}}>My info:</h2>
                <Table striped bordered hover variant="dark" className='w-75'>
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>{user.name}</td>
                    </tr>
                    <tr>
                      <td>Surname</td>
                      <td>{user.surname}</td>
                    </tr>
                    <tr>
                      <td>Username</td>
                      <td>{user.username}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{user.email}</td>
                    </tr>
                    <tr>
                      <td>Member Since</td>
                      <td>{user.created_at}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className='w-50 d-flex flex-column align-items-center my-5'>
                <h3 className='my-5' style={{color: 'white'}}>My Games</h3>
                {
                  (myGames && myGames.length > 0) ?
                  myGames.map((game, index) => (
                      <div key={index} className='border border-info rounded mb-3 d-flex align-items-center w-100 py-3 px-2'>
                        <span id='text'>{game.title} / {game.genre}</span>
                      </div>
                  ))
                  : <p id='text'>No games yet... <Link to='/'>checkout</Link> our newest games for cheap prizes</p>
                }
              </div>
            </div>
            <div className='button d-flex justify-content-center mb-3'>
              <Button variant='outline-light' onClick={handleLogout}>Logout</Button>
            </div>

          </div>
        <Footer />
    </div>
  )
}

export default MyProfile
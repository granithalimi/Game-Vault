import { useLocalStorage } from '@uidotdev/usehooks'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../assets/style/style.css';
import Game from '../components/Game'
import Header from '../components/Header'
import logo from '../assets/images/big_logo.png';
import Footer from '../components/Footer';

function Home() {
  const [logged_in_user, setLogged_in_user] = useLocalStorage("user")
  const navigate = useNavigate()
  const [games, setGames] = useState([])

  useEffect(()=>{
    if(!logged_in_user?.token){
      navigate('/login')
    }
  })

  useEffect(()=>{
    axios.get(`http://localhost/game-vault/api/v1.php?action=get_latest_games&game=${12}`)
    .then(resp => {
      if(resp.data.status === 1){
        setGames(resp.data.games)
      } else if(resp.data.status === 0){
        alert(resp.data.msg)
      }
    })
    .catch(e => console.log(e))
  }, [games])

  return (
    <div className='bg-dark'>
      <Header />
      <div id='bg2' className='d-flex justify-content-end'>
        <div className='w-50 d-flex flex-column align-items-center justify-content-center'>
          <img src={logo} style={{width: "350px"}} className='mb-2' />
          <Link to="/all_games" className='btn btn-lg btn-outline-secondary mt-2'><i className="bi bi-arrow-bar-right"></i> All Games</Link>
        </div>
      </div>
      <div className='container my-5'>
        <div className='row'>
          {
            (games && games.length > 0) ? 
            games.map((game, index) => (
              <div className='col-3 mb-4' key={index}>
                <Game id={game.id} title={game.title} date={game.release_date} thumbnail={game.thumbnail} developer={game.developer} />
              </div>
            )) :
            <p>No Games..</p>
          }
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
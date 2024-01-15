import { useLocalStorage } from '@uidotdev/usehooks'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Game from '../components/Game'
import { Button } from 'react-bootstrap'
import Footer from '../components/Footer'

function AllGames() {
    const [logged_in_user, setLogged_in_user] = useLocalStorage("user")
    const navigate = useNavigate()
    const [games, setGames] = useState([])
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState()
    const [visible, setVisible] = useState(12)
  
    useEffect(()=>{
      if(!logged_in_user?.token){
        navigate('/login')
      }
    })

    useEffect(()=>{
      axios.get(`http://localhost/game-vault/api/v1.php?action=get_games`)
      .then(resp => {
        if(resp.data.status === 1){
          setGames(resp.data.games)
        } else if(resp.data.status === 0){
          alert(resp.data.msg)
        }
      })
      .catch(e => console.log(e))
      
      axios.get(`http://localhost/game-vault/api/v1.php?action=get_game_category`)
      .then(resp => {
        if(resp.data.status === 1){
          setCategories(resp.data.genre)
        }
      })
      .catch(e => console.log(e))
    }, [])

    useEffect(()=>{
      if(category && category.length > 0){
        axios.get(`http://localhost/game-vault/api/v1.php?action=get_game_genre&genre=${category}`)
        .then(resp => {
          if(resp.data.status === 1){
            setGames(resp.data.games)
          }
        })
        .catch(e => console.log(e))
      }
    }, [category])


    const handleClick = e => {
      setVisible(setVisible => setVisible + 12)
    }
    const handleChange = e => {
      setCategory(e.target.value)
    }
  return (
    <div className='bg-dark'>
      <Header />
      <div className='container my-5'>
        <div className='d-flex align-items-center mb-4'>
            <span id='text' className='me-3'>Select Category /</span>
            <select onChange={handleChange} className='form-select form-select-sm w-25'>
              <option value="">Select</option>
              {
                (categories && categories.length > 0) &&
                categories.map((category, index) => (
                  <option key={index} value={category.genre}>{category.genre}</option>
                ))
              }
            </select>
        </div>

        <div className='row'>
          {
            (games && games.length > 0) &&
            games.slice(0, visible).map((game, index) => (
                <div className='col-3 mb-4' key={index} >
                  <Game id={game.id} title={game.title} date={game.release_date} thumbnail={game.thumbnail} developer={game.developer} />
                </div>
            )) 
          }
          <div className='d-flex justify-content-center mt-3 mb-5'>
            <Button variant='light' className='w-25' onClick={handleClick}>Load more...</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AllGames
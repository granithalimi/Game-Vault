import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import "../assets/style/style.css"
import { useNavigate, useParams } from 'react-router-dom'
import { useLocalStorage } from '@uidotdev/usehooks'
import axios from 'axios'
import { Button } from 'react-bootstrap'
function SingleGame() {
    const [logged_in_user, setLogged_in_user] = useLocalStorage("user")
    const navigate = useNavigate()
    const [game, setGame] = useState([])
    const { id } = useParams()
    const [buy_games, setBuy_games] = useState({})

    useEffect(()=>{
        axios.get(`http://localhost/game-vault/api/v1.php?action=get_single_game&id=${id}`)
        .then(resp =>{
            if(resp.data.status === 1){
                setGame(resp.data.game)
            }
        })
        .catch(e => console.log(e))
    })

    const handleBuy = e => {
        e.preventDefault()
        setBuy_games({
            action: 'buy_games',
            user_id: logged_in_user.id,
            game_id: e.target.value
        })
    }

    useEffect(() => {
        if(logged_in_user?.token){
            axios.post('http://localhost/game-vault/api/v1.php', buy_games)
            .then(resp => {
                if(resp.data.status === 1){
                    alert(resp.data.msg)
                }else if(resp.data.status === 0){
                    alert(resp.data.msg)
                }
            })
            .catch(error => console.log(error))
        }
    }, [buy_games])
  return (
    <div className='bg-dark'>
        <Header />
        <div className='container d-flex justify-content-center my-5'>
            <div className='image w-50 '>
                <img style={{width: '75%'}} src={game.thumbnail} />
            </div>
            <div className='w-50 d-flex flex-column justify-content-center'>
                <h1 id='text' className='text-center'>{game.title}</h1>
                <p id='text'><b>Description</b>:<br /> -{game.short_description}</p>
                <p id='text'><b>Genre</b>: -{game.genre}</p>
                <p id='text'><b>Platform</b>: -{game.platform}</p>
                <p id='text'><b>Publisher</b>: -{game.publisher}</p>
                <p id='text'><b>Developer</b>: -{game.developer}</p>
                <p id='text'><b>Release Date</b>: -{game.release_date}</p>
                <Button variant='outline-primary' className='w-25' value={game.id} onClick={handleBuy}>Buy game</Button>
            </div>
        </div>
        <Footer />
    </div>
  )
}

export default SingleGame
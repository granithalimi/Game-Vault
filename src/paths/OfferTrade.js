import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { useLocalStorage } from '@uidotdev/usehooks'
import { useNavigate, useParams } from 'react-router-dom'
import "../assets/style/style.css"
import { Button, Modal } from 'react-bootstrap'

function OfferTrade() {
    const [logged_in_user, setlogged_in_user] = useLocalStorage("user")
    const navigate = useNavigate()
    const { id } = useParams()
    const [friend_games, setFriend_games] = useState([])
    const [myGames, setMyGames] = useState([])
    const [receiver_game_id, set_reciever_game_id] = useState([])
    const [trader_game_id, set_trader_game_id] = useState([])
    const [offer_trade, set_offer_trade] = useState({})
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow_RecieverGameId = e => {
        setShow(true);
        set_reciever_game_id(e.target.value)
    }
    
    useEffect(() => {
        if(!logged_in_user?.id){
            navigate('/pls')
        }
    })

    const handleTraderGameId = e => {
        e.preventDefault()
        set_trader_game_id(e.target.value)
    }

    const handleOfferTrade = e => {
        e.preventDefault()
        set_offer_trade({
            action : 'offer_trade',
            trader_id : logged_in_user.id,
            receiver_id : id,
            trader_game_id : parseInt(trader_game_id),
            receiver_game_id : parseInt(receiver_game_id)
        })
    }
    
    useEffect(() => {
        axios.get(`http://localhost/game-vault/api/v1.php?action=get_my_games&user_id=${id}`)
        .then(resp => {
            if(resp.data.status === 1){
                setFriend_games(resp.data.game)
            }
        })
        .catch(e => console.log(e))
    }, [friend_games])

    useEffect(() => {
        axios.get(`http://localhost/game-vault/api/v1.php?action=get_my_games&user_id=${logged_in_user.id}`)
        .then(resp => {
            if(resp.data.status === 1){
                setMyGames(resp.data.game)
            }
        })
        .catch(e => console.log(e))
    }, [myGames])

    useEffect(() => {
        axios.post(`http://localhost/game-vault/api/v1.php`, offer_trade)
        .then(resp => {
            if(resp.data.status === 1){
                alert(resp.data.msg)
                setShow(false)
            } else if(resp.data.status === 0){
                alert(resp.data.msg)
                setShow(false)
            }
        })
        .catch(e => console.log(e))
    }, [offer_trade])
  return (
    <div id='offer_trade' className='bg-dark'>
        <Header />   
        <div className='container d-flex justify-content-between'>
            <div className='friend w-50 py-5'>
                <h1 className='text-center' id='text'>Friend Games</h1>
                {
                    (friend_games && friend_games.length > 0) ?
                    friend_games.map((friend_game, index) => (
                        <div key={index} className='d-flex justify-content-between align-items0center my-3 border border-info-subtle rounded p-2'>
                            <span id='text'>{friend_game.title}/{friend_game.genre}</span>
                            <Button onClick={handleShow_RecieverGameId} size='sm' value={friend_game.id} variant='outline-light'>Trade</Button>
                        </div>
                    )) 
                    : <p id='text'>No games...</p>
                }
            </div>
    </div>
        <Footer />
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Select Your games</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    (myGames && myGames.length > 0) ?
                    <select className='form-control' onChange={handleTraderGameId}>
                        {
                            myGames.map((game, index) => (
                                <option value={game.id} key={index} selected>{game.title}</option>
                            ))
                        }
                    </select>
                    : <p>No Games</p>
                }
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleOfferTrade}>
                Offer Trade
            </Button>
            </Modal.Footer>
        </Modal>
    </div>
    
  )
}

export default OfferTrade
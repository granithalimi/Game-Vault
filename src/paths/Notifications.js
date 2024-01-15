import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '@uidotdev/usehooks'
import axios from 'axios'

function Notifications() {
  const [logged_in_user, setLogged_in_user] = useLocalStorage("user")
  const navigate = useNavigate()
  const [trades, set_trades] = useState([])
  const [decline_trades, set_decline_trades] = useState()
  const [accept_trades, set_accept_trades] = useState({})
  
  useEffect(() => {
    if(!logged_in_user?.token){
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    axios.get(`http://localhost/game-vault/api/v1.php?action=check_trades&receiver_id=${logged_in_user.id}`)
    .then(resp => {
        if(resp.data.status === 1){
            set_trades(resp.data.trades)
        }
    })
    .catch(e => console.log(e))
  }, [trades])

  const handleDecline = e => {
    e.preventDefault()
    set_decline_trades(e.target.value)
  }

  useEffect(() => {
      if(decline_trades){
          axios.delete(`http://localhost/game-vault/api/v1.php?action=decline_trade&id=${decline_trades}`)
          .then(resp => {
              if(resp.data.status === 1){
                  alert(resp.data.msg)
              }
          })
          .catch(e => console.log(e))
      }
  }, [decline_trades])

  const handleAccept = e => {
    e.preventDefault() 

    set_accept_trades({
        action : "accept_trade",
        trader_id: parseInt(e.target.getAttribute('trader_id')),
        trader_game_id: parseInt(e.target.getAttribute('trader_game_id')),
        receiver_id: parseInt(logged_in_user.id),
        receiver_game_id: parseInt(e.target.getAttribute('receiver_game_id'))
    })

    const trade_id = parseInt(e.target.getAttribute('trade_id'));
    axios.delete(`http://localhost/game-vault/api/v1.php?action=decline_trade&id=${trade_id}`)
    .then(resp => resp)
    .catch(e => console.log(e))
    }

    useEffect(() => {
        if(accept_trades){
            axios.put(`http://localhost/game-vault/api/v1.php`, accept_trades)
            .then(resp => {
                if(resp.data.status === 1){
                    alert(resp.data.msg)
                }
            })
            .catch(e => console.log(e))
        }
    }, [accept_trades])

  return (
    <>
      <Header />
      <div id='notifs'>
        <div className='container'>
          <h1 id='text' className='pt-5'>Trades</h1>
          {
            (trades && trades.length > 0) ?
            trades.map((trade, index) => (
                <div key={index} id={trade.id} className='d-flex justify-content-between w-75 border border-dark-subtle rounded p-4 mt-5 mb-3'>
                    <div className='trade d-flex align-items-center'>
                        <span id='text'><i>{trade.trader_name}</i> wants to trade</span>
                        <span id='text'><b style={{color: "green"}}>{ trade.trader_game_name}</b> for: <b style={{color: "red"}}>{trade.receiver_game_name}</b></span>
                    </div>
                    <div className='buttons'>
                        <button onClick={handleDecline} value={trade.trade_id} className='btn btn-outline-danger'>Decline Trade</button>
                        <button onClick={handleAccept} trade_id={trade.trade_id} trader_id={trade.trader_id} trader_game_id={trade.trader_game_id} receiver_id={trade.receiver_id} receiver_game_id={trade.receiver_game_id} className='btn btn-outline-success ms-2'>Accept Trade</button>
                    </div>
                </div>
            ))
            : <p id='text'>No trade offers</p>
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Notifications
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { useLocalStorage } from '@uidotdev/usehooks'
import { Link, useNavigate } from 'react-router-dom'

function MyFriends() {
    const [logged_in_user, setLogged_in_user] = useLocalStorage("user")
    const navigate = useNavigate()
    const [all_users, setAll_users] = useState([])
    const [myFriends, setMyFriends] = useState([])

    useEffect(() => {
        if(!logged_in_user?.token){
          navigate('/login')
        }
    }, [])

    useEffect(()=> {
        axios.get(`http://localhost/game-vault/api/v1.php?action=get_my_friends&user_id=${logged_in_user.id}`)
        .then(data => setMyFriends(data.data.my_friends))
        .catch(e => console.log(e))
      }, [myFriends])
    
    useEffect(() => {
      axios.get(`http://localhost/game-vault/api/v1.php?action=get_users`)
      .then(resp => {
        if(resp.data.status === 1){
          setAll_users(resp.data.users.filter(u => u.id != logged_in_user.id && !(myFriends.map(f => f.id).includes(u.id))))
        }
      })
      .catch(e => console.log(e))
    }, [all_users])
    
    const handleAddFriend = e => {
      const friend_id = e.target.id
  
      axios.get(`http://localhost/game-vault/api/v1.php?action=add_friends&sender_id=${logged_in_user.id}&receiver_id=${friend_id}`)
      .then(data => {
          if(data.data.status === 1){
            alert(data.data.msg)
          }
      })
      .catch(e => console.log(e))
    }
  return (
    <div className='bg-dark'>
        <Header />
        <div className='bottom my-5 d-flex flex-column align-items-center'>
              <h3 className='my-5' style={{color: 'white'}}>My Friends</h3>
              {
                (myFriends && myFriends.length > 0) ?
                myFriends.map((myFriend, index) => (
                  <div key={index} className='border border-success rounded mb-3 w-50 d-flex align-items-center justify-content-between py-3 px-2'>
                    <span id='text'>{myFriend.name} {myFriend.surname}</span>
                    <div className='buttons'>
                        <Link id={myFriend.id} to={`/offer_trade/${myFriend.id}`} className='btn btn-sm btn-success mx-3'>Offer Trade</Link>
                        <button id={myFriend.id} onClick={handleAddFriend} className='btn btn-sm btn-outline-danger'>Remove Friend</button>
                    </div>
                  </div>
                )) : 
                <p id='text'>No friends :(</p>
              }

              <h3 className='my-5' style={{color: 'white'}}>Suggestions</h3>
              {
                (all_users && all_users.length > 0) &&
                all_users.map((user, index) => (
                  <div key={index} className='border border-info rounded mb-3 w-75 d-flex align-items-center justify-content-between py-3 px-2'>
                    <span id='text' className='ms-3'><b>{user.username}</b> Fullname: <b>{user.name} {user.surname}</b></span>
                    <button id={user.id} onClick={handleAddFriend} className='btn btn-sm btn-primary me-3'>Add Friend</button>
                  </div>
                ))
              }
            </div>
        <Footer />
    </div>
  )
}

export default MyFriends
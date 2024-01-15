import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../assets/style/style.css';

function Game({ title, thumbnail, date, developer, id }) {
  return (
    <Card bg="secondary" style={{ width: '18rem' }} className="mb-2">
      <Card.Img variant="top" src={thumbnail} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          Release date: <i>{date}</i>
          <br />
          Developer: <i>{developer}</i>
        </Card.Text>
        <Button href={`/game/${id}`} variant="outline-dark">Details <i className="bi bi-controller"></i></Button>
      </Card.Body>
    </Card>
  )
}

export default Game
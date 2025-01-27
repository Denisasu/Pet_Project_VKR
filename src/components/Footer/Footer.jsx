import React from 'react'
import { Container } from 'react-bootstrap'
import './Footer.css'

function Footer() {
  return (
    <>
      <Container fluid className="footer">
        <div style={{ display: 'flex', justifyContent:'center', height:'55px', textAlign:'center'}}>
          <h4 style={{ marginTop: '7px', fontWeight: '400', fontSize: '17px' }}>Защитник Природы<br/>
          © Все права защищены </h4>
        </div>
      </Container>
    </>
  )
}

export default Footer

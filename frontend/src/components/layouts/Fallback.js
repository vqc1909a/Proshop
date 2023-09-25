import React from 'react'

function Fallback() {
  return (
    <div className='bg-primary d-flex justify-content-center align-items-center' style={{height: "100vh"}}>
      <p className="display-md-1 display-3 text-white text-center">Cargando Página...</p>
    </div>
  )
}

export default Fallback
import React from 'react'

export const Archivo = ({partitura}) => {
   
  return (
    <embed
    src={`data:application/pdf;base64,${partitura}`}
    type="application/pdf" width="95%" height="700px"/>
  )
}

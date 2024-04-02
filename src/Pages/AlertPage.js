import React from 'react'
import { Alert } from 'antd';
import {ContextAlertaFullPages} from '../App.js';


const AlertPage = () => {

  const [isAlertaFullPages , setIsAlertaFullPages] = React.useContext(ContextAlertaFullPages)


  //There are 4 types of Alert: success, info, warning, error.

  return (
    <div>
      {isAlertaFullPages.type ? 
      <Alert message={isAlertaFullPages.mes} type={isAlertaFullPages.type} />
       : 
      <div></div>}
     
    </div>
  )
}

export default AlertPage

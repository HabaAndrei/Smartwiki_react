import React from 'react'
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {adresaServer , firebaseConfig} from './diverse.js';
import LandingPage from './Pages/LandingPage.js';
import PageChat from './Pages/PageChat.js';
import SignIn from './Pages/SignIn.js'
import SignUp from './Pages/SignUp.js'
import AlertPage from './Pages/AlertPage.js';
import Setari from './Pages/Setari.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';
import {valabilitateAbonament} from './diverse.js'


const ContextUser = React.createContext();
const ContextAlertaFullPages = React.createContext();

const App = () => {

  const [user, setUser] = useState(false);
  const [isAlertaFullPages , setIsAlertaFullPages] = useState({type: false});
  
  /////////////////////////////////////


  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  
  onAuthStateChanged(auth, (user) => {    
    setUser(user);
  });
  function dateDespreAbonament(){
    axios.post(`${adresaServer}/dateDespreAbonament`, {uid: user.uid}).then((data)=>{
      // console.log(typeof data.data[0].ora_inceput_abonament);
      if(!valabilitateAbonament(Number(data.data?.[0]?.ora_inceput_abonament)))return
      user.inf_pers.ora_inceput_abonament = data.data[0].ora_inceput_abonament;
      user.inf_pers.id_subscription = data.data[0].id_subscription;
      user.inf_pers.status_ab = data.data[0].status_ab;
    })
  }
  
  useEffect(()=>{
    if(user){
      axios.post(`${adresaServer}/getInfoAboutU`, {uid: user.uid}).then((data)=>{
        dateDespreAbonament();
        user.inf_pers = data.data[0];
      })
    }
  } , [user])
  
  return (
    <Router>
      <ContextUser.Provider value={[user, setUser]}>
        <ContextAlertaFullPages.Provider value={[isAlertaFullPages , setIsAlertaFullPages]} >
          
          <div >
          
            <div className='alerta' >
              <AlertPage />
              
            </div>
             
            <div  >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="chat" element={<PageChat />} />
                <Route path="signIn" element={<SignIn />} />
                <Route path="signUp" element={<SignUp />} />
                <Route path="settings" element={<Setari/>} />
              </Routes>
            </div>
          </div>
        </ContextAlertaFullPages.Provider>
      </ContextUser.Provider>
    </Router>
  );
}

export { App, ContextUser, ContextAlertaFullPages};

import React from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import {signOut } from "firebase/auth";
import {ReactComponent as SageataStanga} from '../icons/sageataStanga.svg';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {ContextAlertaFullPages, ContextUser} from '../App.js'
import {useNavigate} from "react-router-dom";
import {adresaServer, milisecGreenwich, firebaseConfig} from '../diverse.js';
import axios from 'axios';

const SignIn = () => {

  const [user, setUser] = React.useContext(ContextUser);
  const [isAlertaFullPages , setIsAlertaFullPages] = React.useContext(ContextAlertaFullPages)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  //////////////////////////////////////
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  function conectamUserul(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
       
      const user = userCredential.user;
      setUser(user);
      setIsAlertaFullPages({type: 'success', mes: 'You have successfully logged in'});
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 7000)
      navigate('/chat')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if(errorCode.includes('password')){
        setPasswordError(errorMessage);
      }else if (errorCode.includes('email')){
        setEmailError(errorMessage);
      }else{
        setGeneralError(errorMessage);
      }
      setTimeout(()=>{setEmailError(''); setPasswordError(''); setGeneralError('')}, 6000)
    });
  }


  function neDeconectam(){
    signOut(auth).then(() => {
      setUser(false);
     setIsAlertaFullPages({type: 'success', mes: 'You have successfully logged out'});
     setTimeout(()=>{setIsAlertaFullPages({type: false})}, 7000)
     
    }).catch((error) => {
      console.log(error);
      setIsAlertaFullPages({type: 'error', mes: 'There was a problem logging out'});
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 7000)
    });
  }

  //////////////////////////////////////////
  const provider = new GoogleAuthProvider();
  function neConectamCuGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      const milisec = milisecGreenwich();
      axios.post(`${adresaServer}/insertDateU_google`, {
        uid: user.uid, email:user.email, name: user.displayName, milisec,  metoda_creare: 'google'
      }).then((data)=>{
        // console.log(data);
      })
      
      setUser(user);
      setIsAlertaFullPages({type: 'success', mes: 'You have successfully logged in'});
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 7000)

      navigate('/chat');
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      setIsAlertaFullPages({type: 'error', mes: 'There was a problem logging in'});
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 7000)
    });
  }

  return (
  <div  >
    <div onClick={()=>{navigate('/')}} className='sageataStangaSus' ><SageataStanga/></div>

    { !user ? 
    <div  className='mainContainer' >
      <div className='titleContainer'>
        <div>Log in</div>
      </div>
      <label className="errorLabel">{generalError}</label>
      <br />
      <div className={'inputContainer'}>
        <input
          type='email'
          value={email}
          placeholder="Enter your email here"
          onChange={(event) => setEmail(event.target.value)}
          className='inputBox'
        />
        <label className="errorLabel">{emailError}</label>
      </div>

      <br />
      <div className={'inputContainer'}>
        <input
          type='password'
          value={password}
          placeholder="Enter your password here"
          onChange={(event) => setPassword(event.target.value)}
          className='inputBox'
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className='inputContainer'>
        <input className='inputButton' type="button" onClick={()=>conectamUserul(email, password)} value={'Log in'} />
      </div>

      <br/>
      <br/>
      <button onClick={neConectamCuGoogle}  className="gsi-material-button">
        <div className="gsi-material-button-state"></div>
        <div className="gsi-material-button-content-wrapper">
          <div className="gsi-material-button-icon">
            <svg version="1.1"  viewBox="0 0 48 48"  style={{display: 'block'}}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span className="gsi-material-button-contents">Continue with Google</span>
          <span  style={{ display: 'none' }}>Continue with Google</span>
        </div>
      </button>
    </div> :
    <div className='mainContainer' > 
      <input className='inputButton' type="button" onClick={neDeconectam} value={'Log out'} />
    </div>
    }
  </div>
  )
}

export default SignIn

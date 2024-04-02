import React from 'react'
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {ContextUser, ContextAlertaFullPages} from "../App.js";
import {useNavigate} from "react-router-dom";
import {ReactComponent as SageataStanga} from '../icons/sageataStanga.svg';
import {adresaServer, milisecGreenwich, firebaseConfig} from '../diverse.js';
import axios from 'axios';

const SignUp = () => {

  const [user, setUser] = React.useContext(ContextUser);
  const [isAlertaFullPages , setIsAlertaFullPages] = React.useContext(ContextAlertaFullPages)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('');
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [nameError, setNameError] = useState('')
  const [surnameError, setSurnameError] = useState('')
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  ///////////////////////////////
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  ///////////////////////////////////

  function creamCont(email, password){
    let avemEroare = false;
    if(!name){
      setNameError('please write your name');
      setTimeout(()=>{setNameError('')}, 5000);
      avemEroare = true;
    }
    if(!surname){
      setSurnameError('please write your surname');
      setTimeout(()=>{setSurnameError('')}, 5000);
      avemEroare = true;
    }
    if(avemEroare)return ;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      setUser(userCredential.user);

      const {uid, email, } = userCredential.user;
      const milisec = milisecGreenwich();
      axios.post(`${adresaServer}/insertDateU_email_password`, {
        uid, email, name: name + ' ' + surname, milisec, metoda_creare : 'email&password'
      }).then((data)=>{
        // console.log(data);
      })

      setName('');
      setSurname('');
      setPassword('');
      setEmail('');
      setIsAlertaFullPages({type: 'success', mes: 'Account created successfully'});
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 10000)

      navigate('/chat');
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

  useEffect(()=>{
    if(user)navigate('/chat');
  }, [])

  ///////////////////////////////////////////////////////

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
      setIsAlertaFullPages({type: 'success', mes: 'Account created successfully'});
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 10000)
      ////////////
      navigate("/chat")
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      //There was an error creating the account
      setIsAlertaFullPages({type: 'error', mes: `There was an error creating the account: ${errorMessage} `});
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 10000)
    });
  }

  return (
    <div className='mainContainer' >
      <div onClick={()=>{navigate('/')}} className='sageataStangaSus' ><SageataStanga/></div>

      <div className='titleContainer'>
        <div>Sign up</div>
      </div>
      <label className="errorLabel">{generalError}</label>
      <br />

      <div className={'inputContainer'}>
        <input
          value={name}
          placeholder="Enter your name here"
          onChange={(event) => setName(event.target.value)}
          className='inputBox'
        />
        <label className="errorLabel">{nameError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={surname}
          placeholder="Enter your surname here"
          onChange={(event) => setSurname(event.target.value)}
          className='inputBox'
        />
        <label className="errorLabel">{surnameError}</label>

      </div>
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
        <input  onClick={()=>creamCont(email, password)} className='inputButton' type="button"  value={'Sign up'} />
      </div>

      <br />
      <br />
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
    
    
    </div>
  )
}

export default SignUp

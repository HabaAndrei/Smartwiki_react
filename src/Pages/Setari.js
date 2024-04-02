import React from 'react'
import { useState, useContext ,useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import {ReactComponent as SageataSus} from '../icons/sageataSus.svg';
import {ReactComponent as SageataJos} from '../icons/sageataJos.svg';
import {ReactComponent as Chat} from '../icons/chat.svg';
import {ReactComponent as Info } from '../icons/info.svg';
import {ContextUser, ContextAlertaFullPages} from '../App.js';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { useStepContext } from '@mui/material';
import { damData } from '../diverse';
import { styleDoiJS } from "../stylinguri.js";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { adresaServer } from '../diverse';
import axios from 'axios';


const Setari = () => {

  const navigate = useNavigate();
  const [user, setUser] = React.useContext(ContextUser);
  const [isNav, setIsNav] = useState(true);
  const [infNumber, setInfNumber] = useState(1);
  const [modalStopRecurrence, setModalStopRecurrence] = useState(false);
  const [istoricCredite, setIstoricCredite] = useState([]);
  const [istoricBuy, setIstoricBuy] = useState([]);

  function stergemSubscriptiaAbonament(){
    axios.post(`${adresaServer}/stergemSubscriptia`, {
      id_subscription: user.inf_pers.id_subscription , 
      email: user.email
    }).then((data)=>{
      if(data.data === 'ok'){
        setModalStopRecurrence(false);
        console.log('am reusit')
        user.inf_pers.status_ab = 'canceled'
      };
      // aici cand vine raspunusl sa sterg statusul in anulat
    })
  }
  function luamIstoricCredite(){
    axios.post(`${adresaServer}/luamIstoricCredite`, {uid : user.uid}).then((data)=>{
      setIstoricCredite(data.data)
    })
  }
  function luamIstoricBuy(){
    axios.post(`${adresaServer}/luamIstoricBuy`, {email: user.email}).then((data)=>{
      setIstoricBuy(data.data);
    })
  }

  useEffect(()=>{
    if(user === null){
      navigate('/');
    }

    if(!user)return;
    luamIstoricCredite()
    luamIstoricBuy()
    // console.log('ne randam');
  }, [user])
  return (
    <div  className='divTotSet'  >
        
      <div className={isNav ? 'divSusSet' : 'displayNimic' }  >   
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          
          <div className="items-center justify-between  " id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <button href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page"><Link to='/chat' >Chat page <Chat/> </Link></button>
              </li>
              <li>
                <button onClick={()=>setInfNumber(1)} href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About me <Info/> </button>
              </li>
              <li>
                <button onClick={()=>setInfNumber(2)} href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Tokens used</button>
              </li>
              <li>
                <button href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"><Link to='/signIn'>Log out</Link></button>
              </li>
            </ul>
          </div>
          </div>
          {isNav ? 
            <div onClick={()=>{setIsNav(!isNav)}} className='arrow-container' ><SageataSus/></div> : <div></div>
          }
        </nav>

      </div>

      <div className={isNav ? 'divJosSet' : ''} >
      {!isNav ? 
        <div onClick={()=>{setIsNav(!isNav)}} className='arrow-container' ><SageataJos/></div> : <div></div>
      }


      {infNumber === 1 ?
      <div  className='divDateDinR_part_set' > 

        <img src={user?.providerData?.[0]?.photoURL} />

        <ul className="space-y-4 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>
            Name
            <ol className="ps-5 mt-2 space-y-1  list-inside">
              <li>{user?.inf_pers?.nume}</li>
            </ol>
          </li>
          <li>
            Email
            <ol className="ps-5 mt-2 space-y-1  list-inside">
              <li>{user?.email}</li>
            </ol>
          </li>
          <li>
            Last login
            <ol className="ps-5 mt-2 space-y-1  list-inside">
              <li>{damData(user?.reloadUserInfo?.lastLoginAt)}</li>
            </ol>
          </li>
          <li>
            Created at
            <ol className="ps-5 mt-2 space-y-1  list-inside">
              <li>{damData(user?.reloadUserInfo?.createdAt)}</li>
            </ol>
          </li>

          {user?.providerData?.[0]?.providerId  === 'google.com' &&
          <li>
            Created with: 
            <ol>
              <li>
              <button  className="gsi-material-button">
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
                  <span className="gsi-material-button-contents"></span>
                  <span  style={{ display: 'none' }}></span>
                </div>
              </button>
              </li>
            </ol>

          </li>
          }

          {(user?.inf_pers?.ora_inceput_abonament && user?.inf_pers?.status_ab != 'canceled') ? 
          <li>
            Subscription with monthly recurrence
            <ol className="ps-5 mt-2 space-y-1  list-inside">
              <li>
              <button onClick={()=>setModalStopRecurrence(true)} >Cancel recurrence</button>
              </li>
            </ol>
          </li> : <></>
          }

          {(user?.inf_pers?.ora_inceput_abonament && user?.inf_pers?.status_ab === 'canceled') ? 
          <li>
            The subscription with monthly recurrence is canceled
          </li> : <></>
          }
        </ul>

        <Modal
          open={modalStopRecurrence}
          onClose={()=>{setModalStopRecurrence(false)}}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleDoiJS}>
            <div className="p-4 md:p-5 text-center">
              <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to stop this recurrence?</h3>
              <button  onClick={stergemSubscriptiaAbonament} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                  Yes, I'm sure
              </button>

              <button onClick={()=>{setModalStopRecurrence(false)}} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
            </div>
          </Box>
        </Modal>
      </div> : <div></div>
      }

      {infNumber === 2 ?  
      <div className='istoricInDoua'> 

        <div className='istoricStanga' >
          <ol className="relative border-s border-gray-200 dark:border-gray-700">  
            {istoricBuy.map((obiect, index)=>{
              return <li key={index} className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{damData(obiect.ora)}</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-black">Mothod: {obiect.mode}</h3>
                {obiect.mode  === 'payment' ? <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400" >Tokens number: {obiect.nr_tokeni}</p>
                :<p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400" >Status: {obiect.status_ab}</p>}
                
              </li>
            })}  
          </ol>

          {/* {istoricBuy.map((obiect, index)=>{
            return <div key={index}  >
              <p>Mothod: {obiect.mode}</p>
              {obiect.mode  === 'payment' ? <p>Tokens number: {obiect.nr_tokeni}</p>:
                <p>Status: {obiect.status_ab}</p>}
              <p>At: {damData(obiect.ora)}</p>
            </div>
          })} */}
          
        </div>

        
        <div className='istoricDreapta' >
          <ol className="relative border-s border-gray-200 dark:border-gray-700">  
            {istoricCredite.map((obiect, index)=>{
              return <li key={index} className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">{damData(obiect.ora)}</time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-black"></h3>
                <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                  {obiect?.nr_credite?.includes('-') ? ` ${obiect.nr_credite} token ` : ` +${obiect.nr_credite} tokens ` }
                </p>
              </li>
            })}                
            {/* <li className="mb-10 ms-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
              <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
            </li> */}
           
            
          </ol>
        {/* {istoricCredite.map((obiect, index)=>{

          console.log(obiect)
          return <div key={index} >
            <p>At: {damData(obiect.ora)}
            {obiect?.nr_credite?.includes('-') ? ` ${obiect.nr_credite} token ` : 
            ` +${obiect.nr_credite} tokens ` }
            </p>
           
            
          </div>
        })} */}
        </div>



      </div> : <div></div>
      }




    </div>

        
    </div>
  )
}

export default Setari

import React from 'react'
import { useEffect,   useState } from 'react';
import {useNavigate} from "react-router-dom";
import {ContextUser, ContextAlertaFullPages} from '../App.js';
import {ReactComponent as SageataDreapta} from '../icons/sageataDreapta.svg'
import {ReactComponent as SageataStanga} from '../icons/sageataStanga.svg';
import {ReactComponent as Send} from '../icons/send.svg';
import {ReactComponent as CosGunoi} from '../icons/cosGunoi.svg';
import {ReactComponent as Chat} from '../icons/chat.svg';
import {ReactComponent as Setari} from '../icons/setari.svg';
import { styleDoiJS } from "../stylinguri.js";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { adresaServer, damData, milisecGreenwich, dataPesteOLuna } from '../diverse.js';
import uuid from 'react-uuid';
import axios from 'axios';
import { Spinner } from 'flowbite-react';

const PageChat = () => {
 


  const navigate = useNavigate();
  const [user, setUser] = React.useContext(ContextUser);
  const [isAlertaFullPages , setIsAlertaFullPages] = React.useContext(ContextAlertaFullPages)

  const [isNav, setIsNav] = useState(true);
  const [scrisInInput, setScrisInInput] = useState('');
  const [arCuObMesaje, setArCuObMesaje] = useState([]);
  const [arCuConv, setArCuConv] = useState([]);
  const [isModalDelete , setIsModalDelete] = useState({type: false});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalCheckout, setIsModalCheckout] = useState(false);

  const arrayCuOferteDeTokeni = [{nume: 'Small package' , cantitate: '200 tokens', pret: '2€', idProdus: 'price_1P0qTiLpkRDhf4wTrOgurXzM'}, 
    {nume: 'Normal package' , cantitate: '500 tokens', pret: '4€', idProdus: 'price_1P0qUWLpkRDhf4wTAoBMoY05'}, 
    {nume: 'Large package' , cantitate: 'unlimited tokens / monthly', pret: '10€', idProdus: 'price_1P0qV4LpkRDhf4wToFT7Ah9d'}]

  function stergemParamDinUrl(param){
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(param);
    window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
  }

  function luamIdDinUrl(param){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function luamMesDupaIdConv(id_conv){
    if(!id_conv)return;
    axios.post(`${adresaServer}/luamMesDupaIdConv`, {id_conversatie: id_conv}).then((data)=>{
      // console.log(data.data, 'ar obicte cu mesaje!!!!!!!!!!!!!!!!!')
      if(data.data.length){
        const oraPrimuluiMesaj = data.data[0].data;
        const primulObiect = {data: oraPrimuluiMesaj, tip_mesaj: 'ora'};
        let arCuObNou = [];
        for(let i = 0; i<data.data.length ; i++){
          let obiectActual = data.data[i]
          let dataUnu = damData(data.data[i].data).slice(8 , 10);
          let dataDoi = damData(data?.data?.[i + 1]?.data).slice(8 , 10);
          if(dataUnu < dataDoi && dataUnu && dataDoi && data.data[i+1]){
            arCuObNou.push(obiectActual, {data: data?.data[i + 1 ]?.data, tip_mesaj: 'ora'})
            continue;
          }
          arCuObNou.push(obiectActual);
        }
        setArCuObMesaje([primulObiect, ...arCuObNou])
      }else{
        setArCuObMesaje(data.data);
      }

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('conv', id_conv);
      window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
    });
  }

  useEffect(()=>{
    if(user === null){
      navigate('/');
    }
    if(user){
      axios.post(`${adresaServer}/luamConv`, {uid: user.uid}).then((data)=>{
        setArCuConv(data.data);
      })
    }
  }, [user]);

  useEffect(()=>{
    luamMesDupaIdConv(luamIdDinUrl('conv'));
    if(luamIdDinUrl('met')){
      if(luamIdDinUrl('met') === 'cancel'){
        setIsAlertaFullPages({type: 'error', mes: 'Unfortunately, the transaction did not succeed'});
      }else{
        setIsAlertaFullPages({type: 'success', mes: 'The transaction was successful'});
      }
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 5000)
      stergemParamDinUrl('met')
    }

  }, []);


  function stocamConversatiaInDb(uid, id_conversatie, data){
    axios.post(`${adresaServer}/stocamConversatiaInDb`, {uid, id_conversatie, data}).then((data)=>{
    })
  }

  const adaugamRandNou = (e)=>{
    if(e.key === 'Enter'){
      setScrisInInput((prev)=>{
        return prev + '\n';
      })
    }
  }

  function verificamTokeni(){
    if(user?.inf_pers?.ora_inceput_abonament)return true;
    if(Number(user?.inf_pers?.nr_tokeni) < 1){
      // activez eroare cu setTimeout pentru a nu imi bloca aplicatai
      // daca nu fac asa aplicatia mi se blocheaza, fara motiv, nu imi apare nicio eroare 
      setTimeout(()=>setIsAlertaFullPages({type: 'error', mes: `Unfortunately, you have no more tokens. You have to buy it.`}), 500 )
      setTimeout(()=>{setIsAlertaFullPages({type: false})}, 7000)
      return false
    }
    return true;
  }
  
  function trimitCerereAI(){
    if(!verificamTokeni())return;
    try{
      if(!scrisInInput.length)return;
      let mesIntrebare = scrisInInput;
      setScrisInInput('');
      setIsLoading(true);
      setArCuObMesaje((prev)=>{
        if(prev.length){
          let dataUnu = damData(prev[prev.length - 1].data).slice(0, 10);
          let dataDoi = damData(milisecGreenwich()).slice(0, 10);
          if(dataUnu < dataDoi && dataUnu && dataDoi ){
            return [...prev, {tip_mesaj: 'ora', data: milisecGreenwich()}, {tip_mesaj: 'intrebare', mesaj: mesIntrebare, data: milisecGreenwich()}, 
                {tip_mesaj: 'raspuns', mesaj: '', data: milisecGreenwich()} 
            ]
          }else{
            return [...prev, {tip_mesaj: 'intrebare', mesaj: mesIntrebare, data: milisecGreenwich()}, 
                {tip_mesaj: 'raspuns', mesaj: '', data: milisecGreenwich()}
            ]
          }
        }else{
          return [{tip_mesaj: 'ora', data: milisecGreenwich()}, {tip_mesaj: 'intrebare', mesaj: mesIntrebare, data: milisecGreenwich()},
              {tip_mesaj: 'raspuns', mesaj: '', data: milisecGreenwich()}  
          ]

        }
      })

      let arDeTrimisInServer = [];
      if(arCuObMesaje.slice(-7).length){
        let nr = 0;
        let ob = {}
        let ar = arCuObMesaje.slice(-7)
        ar.reverse();
        for(let obiect of ar.reverse()){
          if(nr === 2){arDeTrimisInServer.push(ob); nr = 0};
          if(obiect.tip_mesaj === 'intrebare')ob.intrebare = obiect.mesaj;
          if(obiect.tip_mesaj === 'raspuns')ob.raspuns = obiect.mesaj;
          nr++
        }
      }
      

      fetch('https://ai.smartwiki.site/cerereAI' , {
        method: "POST",
        headers: {
        'Content-Type' : 'application/json'
        },
        body: JSON.stringify({intrebare: mesIntrebare, context: arDeTrimisInServer})
        }).then((data)=>data.json()).then((data)=>{

          if(!user.inf_pers?.ora_inceput_abonament){
            user.inf_pers.nr_tokeni = user.inf_pers.nr_tokeni - 1;
          }
          
          if(!luamIdDinUrl('conv')){

            const id = uuid().slice(0, 10);
            stocamConversatiaInDb(user.uid, id, milisecGreenwich())
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('conv', id);
            window.history.pushState(null, '', `${window.location.pathname}?${urlParams}`);
            setArCuConv((prev)=>{
              return [...prev, {mesaj: mesIntrebare, id_conversatie: id}]
            })
          }
          setArCuObMesaje((prev)=>{
            if(prev[prev.length - 1].tip_mesaj === 'raspuns'){
              prev[prev.length - 1].mesaj = data.raspuns;
              setIsLoading(false);
            }
            return [...prev];
            // return [...prev, {tip_mesaj: 'raspuns', mesaj: data.raspuns, data: milisecGreenwich()}]
          })
         
          axios.post(`${adresaServer}/stocamMesInDb`, {
            arMes: [ {
              tip_mesaj: 'intrebare', mesaj: mesIntrebare, 
            }, {tip_mesaj: 'raspuns', mesaj: data.raspuns}], 
            id_conversatie:luamIdDinUrl('conv'), data: milisecGreenwich(), uid: user.uid
          }, ).then((data)=>{
            // console.log(data);
          })
        }) 
    }catch (err){
      console.log(err, 'eroarea din catch');
    }
  }

  function stergemConversatiaCuModal(){
    axios.post(`${adresaServer}/stergemConversatia`, {id_conversatie: isModalDelete.id}).then((data)=>{
      if(isModalDelete.id === luamIdDinUrl('conv')){
        stergemParamDinUrl('conv');
        setArCuObMesaje([]);
      }
      setArCuConv((arCuOb)=>{
        let arNou = [];
        for(let obiect of arCuOb){
          if(obiect.id_conversatie === isModalDelete.id)continue;
          arNou.push(obiect);
        }
        return arNou;
      })
      setIsModalDelete({type:false})
    })
  }

  function deruleazaInJos (){
    const element = document.getElementById('scrollJos');
    element.scrollTop = element.scrollHeight;
  
  };
  useEffect(()=>{
    deruleazaInJos();
  }, [arCuObMesaje])

  function faceNewChat(){
    stergemParamDinUrl('conv');
    setArCuObMesaje([]);
  }


  ///////////////////////////////

  ///////////////////////////////
  return (
    <div className='fullPage'  >
      <div className={isNav ? 'leftPart  robotic-text': 'displayNimic'} >
        <div className='divUnu' >
          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <Link to='/settings' >Setings </Link> <Setari/> 
          </button>
        </div>
        <br/>
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={faceNewChat}   >New Chat<Chat/></button>

        <br/>
        <div className='divDoi'>
          {user?.inf_pers?.nr_tokeni ? <h4>Credits: {user?.inf_pers?.nr_tokeni}</h4> : <h4></h4>}
          <br/>
          <div className='divCuConv' >
            <ul className='listaConv'  >
              {arCuConv.map((obiect)=>{
                return  <li key={obiect.id_conversatie}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p onClick={() => luamMesDupaIdConv(obiect.id_conversatie)} style={{ marginRight: "10px" }}>{obiect.mesaj.slice(0, 15)}</p>
                    <CosGunoi onClick={()=>{ setIsModalDelete({type: true, id:obiect.id_conversatie })}} className='cosGunoi'/>
                  </div>
                </li>
              })}
            </ul>
          </div>

         
          

        </div>
        <div className='divTrei' >
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
           onClick={()=>setIsModalCheckout(true)} >Buy tokens</button>
        </div>
      </div>


      {/************************* */}

      <Modal
        open={isModalCheckout}
        onClose={()=>setIsModalCheckout(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                      Product
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Qty
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {arrayCuOferteDeTokeni.map((obiect)=>{
                  return <tr key={obiect.idProdus} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {obiect.nume}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {obiect.cantitate}     
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {obiect.pret}
                    </td>
                    <td className="px-6 py-4">
                       
                      {/* <form action={`${adresaServer}/create-checkout-session?param=${obiect.idProdus}`} method="POST">
                        <button type="submit">
                          <a className="font-medium text-red-600 dark:text-green-500 hover:underline">Buy</a>
                        </button>
                      </form>  */}

                      {obiect.idProdus === 'price_1Ow7IHLpkRDhf4wTJAiP2PPx' && user?.inf_pers?.ora_inceput_abonament  ? 
                      <div>The next payment will be made at: {damData(dataPesteOLuna(Number(user?.inf_pers?.ora_inceput_abonament))).slice(0, 10)} </div> :
                      <form action={`${adresaServer}/create-checkout-session?param=${obiect.idProdus}`} method="POST">
                        <button type="submit">
                          <a className="font-medium text-red-600 dark:text-green-500 hover:underline">Buy</a>
                        </button>
                      </form> 
                      }
                    </td>
                </tr>
                })}

              </tbody>
            </table>
          </div>
        </Box>
      </Modal>
      {/**************************** */} 


     {/*******************************/}
      <div className='rightPart' >
        <div onClick={()=>{setIsNav(!isNav)}} className='arrow-container' >{isNav ? <SageataStanga/> : <SageataDreapta/>}</div>
        
        <div className='divSus' >
          {/*Div sus */}
        </div>

        {/***************  ********** */}


        <div className='divMijloc  divConv' id='scrollJos'  >
          <Modal
            open={isModalDelete.type}
            onClose={()=>{setIsModalDelete({type: false})}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={styleDoiJS}>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this chat?</h3>
                <button onClick={stergemConversatiaCuModal} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                    Yes, I'm sure
                </button>

                <button onClick={()=>{setIsModalDelete({type: false})}} data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
              </div>
            </Box>
          </Modal>

          {/****************************** =>>>>> conversatia */}
          <div className='divConversatie' >
            {arCuObMesaje.length ?
              arCuObMesaje.map((obiect, index)=>{
                if(obiect.tip_mesaj === 'intrebare'){
                  return <div key={index} className="flex items-start gap-2.5 marginDreaptaCovAi justify-end">
                    <div className="divIntrebareAi flex flex-col w-full max-w-[600px] leading-1.5 p-4 border-gray-200 rounded-l-xl rounded-tr-xl dark:bg-gray-700">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">You</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{damData(obiect.data).slice(11, 16)}</span>
                      </div>
                      <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{obiect.mesaj}</p>
                    </div>
                  </div>
                }else if(obiect.tip_mesaj === 'raspuns'){
                  return <div key={index} className="flex items-start gap-2.5 marginStangaCovAi ">
                    <div className="  flex flex-col w-full max-w-[600px] leading-1.5 p-4 border-gray-200  rounded-e-xl rounded-es-xl dark:bg-gray-700">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">AI</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{damData(obiect.data).slice(11, 16)}</span>
                      </div>
                      {isLoading && (index == arCuObMesaje.length - 1) ? 
                        <Spinner aria-label="Extra large spinner example" size="xl" />
                      : <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{obiect.mesaj}</p>
                      }  
                    </div>
                  </div>
                }else if(obiect.tip_mesaj === 'ora'){
                  return <div className='divDataCentru   text-sm font-normal text-gray-500 dark:text-gray-400' key={index} > {damData(obiect.data).slice(0, 10)} </div>
                }
              }) : 
              <div></div>
            }
          </div>

    
          {/*  <== conversatie  *********************/}
        </div>


        {/************************** */}
        <div  className='divJos' >
          <input
          onChange={(event)=>setScrisInInput(event.target.value)}
          onKeyDown={adaugamRandNou}
          className="chat-input"
          type="text"
          placeholder="Write a question ..."
          value={scrisInInput}
          />

          <button 
          onClick={trimitCerereAI}
          className='butonSend' >
            <Send/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageChat;


// sa nu las clientul pe aceste pagina daca nu este conectat, parctic daca nu are cont sa nu vina aici

const adresaServer = 'https://api.smartwiki.site'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY ,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENTID
}

function valabilitateAbonament(milisecunde){
    // milisec adica milisecGreenwich
  let dataCurenta_UTC = new Date();
  let offset_UTC = dataCurenta_UTC.getTimezoneOffset(); 
  let dataCurenta_GMT = new Date(dataCurenta_UTC.getTime() + (offset_UTC * 60 * 1000));

  let dataDinMilisecunde = new Date(milisecunde);
  let dataDinMilisecunde_GMT = new Date(dataDinMilisecunde.getTime() + (offset_UTC * 60 * 1000)); 

  if (dataCurenta_GMT.getUTCFullYear() === dataDinMilisecunde_GMT.getUTCFullYear() && 
      dataCurenta_GMT.getUTCMonth() === dataDinMilisecunde_GMT.getUTCMonth()) {
      return true; 
  } else {
      return false; 
  }
    
}

function milisecGreenwich() {
  let  date = new Date(); 
  let utc = date.getTime() + (date.getTimezoneOffset() * 60000); 
  let  currentTimeMillisGMT = utc + (3600000 * 0); 
  return currentTimeMillisGMT;
}



function damData(milisecDinUk){
  let milisUK = milisecGreenwich();
  let milisecAici = new Date().getTime();
  let diferenta = milisecAici - milisUK;
  const date = new Date(Number(milisecDinUk) + diferenta); 
  let year = date.getFullYear();
  let month = date.getMonth() + 1; 
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();  
  let formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;  
  return formattedDate;
}

function dataPesteOLuna(milisecunde){
  let data = new Date(milisecunde);

  // Obținem luna curentă și anul curent
  let lunaCurenta = data.getMonth();
  let anulCurent = data.getFullYear();

  let lunaUrmatoare = lunaCurenta + 1;
  let anulUrmator = anulCurent;

  if (lunaUrmatoare === 12) {
    lunaUrmatoare = 0; 
    anulUrmator++;
  }

  data.setMonth(lunaUrmatoare);
  data.setFullYear(anulUrmator);

  return data.getTime();
}

export {
  adresaServer, milisecGreenwich, damData, firebaseConfig, valabilitateAbonament, dataPesteOLuna
}

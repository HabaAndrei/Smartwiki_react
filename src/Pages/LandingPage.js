import React from 'react';
import '../LandingPage.css';
import { Link } from "react-router-dom";
import {ContextUser} from '../App.js'



const LandingPage = () => {

    const [user, setUser] = React.useContext(ContextUser);


  return (
    <div className="App">
    <div className="background">
      <div className="stars"></div>
      <div className="clouds"></div>
      
    </div>
    <div className="content">
      <h4 href="#" >  Wiki platform  </h4>
      <br/>
      <h1 className="arrow-heading">It has never been easier to find </h1>
      <br/>
      <br/>
      <div className="vortex">
        <p className='centru_vortex' >Wiki platform</p>
      </div>
      <br/>
      <br/>      
      <h1 className="arr-heading"> a valid answer with a specific question</h1>

      <div className="info-box">
        <br/>
        <h2>This platform helps you to have a valid and simple answer to your questions. </h2>
        <br/>
        <p>Our platform leverages advanced artificial intelligence algorithms, coupled with comprehensive data sourced from Wikipedia, to offer unparalleled assistance tailored to your specific inquiries. Employing meticulously crafted filters, we ensure that every response generated is not only accurate but also highly reliable, instilling confidence in the veracity of the information provided.</p>
        <br/>
        <br/>
        <p>Come to the platform to ask what's bothering you. </p>

        {user ?
        <p href="#">
            <Link to="/chat">Continue</Link>
        </p>:
        <ul>
            <li><p href="#"><Link to='/signIn'>Sign in </Link></p></li>
            <li><p href="#"><Link to='/signUp' >Sign up</Link></p></li>
        </ul> 
        }
      </div>
    </div>
  </div>
  );
};

export default LandingPage;

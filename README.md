
## Environments
The React application is deployed using Nginx.

## Usage Instructions
I recommend creating an account. You can do this with a username and password, but it's much easier to use Google sign-in.
Upon creating an account, you'll receive 10 tokens to test and use the application. Later, you can either subscribe or purchase tokens individually.

## Tech
Smartwiki is a web application composed of three modules: React, node, and AI, each having its own Github repository.

- The React is built with React and Google Firebase.
- Firebase is used for authentication and analytics only.
- Deployed on [smartwiki.site](https://smartwiki.site)


## Application Structure
The frontend objects are divided into Pages and Components.
Users can sign in either with username and password, or with a Google account.

## Description 

**"AlertPage.js"**
Within the context of *"ContextAlertaFullPages,"* alerts and notification information are managed across all pages. I have implemented this context to ensure a consistent and uniform experience for users, regardless of the page they are on.

**"SignUp.js / SignIn.js"**
These pages facilitate the user login process using the Google Firebase service. Functionality is configured to allow users to log in using their Google account or by manually entering an email address and password. The *"neConectamCuGoogle"* function facilitates logging in with a Google account, while the *"creamCont"* function allows creating an account using an email address and password.

**"PageChat.js"**
This page manages the main interaction with the user. The *"arrayCuOferteDeTokeni"* list contains products available for purchase, including products with instant purchase and monthly subscriptions with unlimited access to services. The *"stergemConversatiaCuModal"* function deletes conversations between the user and the developed AI, while *"trimitCerereAI"* sends the message and conversation history to a Flask server (Gunicorn) for processing. The *"deruleazaInJos"* function ensures automatic scrolling of the conversation down to keep the focus on the latest messages. Using state variables *"arCuObMesaje"* and *"arCuConv"* allows storing and managing message and conversation information.

Additionally, the user is restricted from interacting with the AI without having enough tokens or an active subscription, according to the *"verificamTokeni"* function.

**"Setari.js"**
This page manages the token usage history, payment history, and user account settings. The user has the option to cancel an active subscription using the *"stergemSubscriptiaAbonament"* function. Integration with Stripe facilitates payment and subscription management through the *"luamIstoricCredite"* and *"luamIstoricBuy"* functions.



## Screenshots

- **Landing Page**
  ![Landing Page Screenshot](https://github.com/HabaAndrei/Smartwiki_react/blob/main/pozeProiect/wiki_landingpage.png)

- **Chat_Page**
  ![Chat_Page Screenshot](https://github.com/HabaAndrei/Smartwiki_react/blob/main/pozeProiect/wiki_chat.png)

- **Settings Page**
  ![Settings Page Screenshot](https://github.com/HabaAndrei/Smartwiki_react/blob/main/pozeProiect/wiki_settings.png)

- **Sign up Page**
  ![Sign up Page](https://github.com/HabaAndrei/Smartwiki_react/blob/main/pozeProiect/wiki_sign_up.png)

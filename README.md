# Talkie – Real-Time Chat App

## Table of Contents
- [Overview](##-overview-)
- [Technologies Used](##-technologies-used-)
- [Key Features](##-key-features-)
- [How to Contribute](#-getting-started-)


---
## 🌟 Overview 🌟
Talkie is a real-time chat application designed for instant messaging and group conversations. Built using React, Node.js, and MongoDB, it allows users to:
#### Log in or sign up securely with JWT authentication.
#### Send direct messages with text, emojis, and files.
#### Create and manage channels for group conversations with multiple users.
#### Experience a clean, responsive, and interactive UI.
#### This project is ideal for learning full-stack development and real-time applications using Socket.IO.

## ⚙️ Technologies Used ⚙️
### Frontend
##### React – Frontend library for building UI components
##### TailwindCSS – Styling and responsive design
##### Lottie – Animations for empty chat states
##### React Icons – UI icons

### Backend
##### Node.js & Express.js – RESTful API server
##### MongoDB & Mongoose – Database for storing users, messages, and channels
##### JWT – Authentication
##### Socket.IO – Real-time messaging

## ✨ Key Features ✨
### 📱 User Authentication – Encrypted passwords & JWT-based login.
### 💬 Direct Messaging – Real-time 1:1 chats with media sharing.
### 👥 Group Channels – Create and manage group conversations easily.
### 🔒 Secure – Protected APIs and safe data handling.

## 📸 Screenshots
### Signin/SignUp Page
<div style="text-align: center;">
  <img src="https://raw.githubusercontent.com/Arshia-163/chat_app/master/Images/signin.png" 
       alt="Login Page" width="45%" 
       style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);" />
  <img src="https://raw.githubusercontent.com/Arshia-163/chat_app/master/Images/signup.png" 
       alt="SignUp Page" width="45%" 
       style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);" />
</div>

### Main Page with Direct Messages & Channels
<div style="text-align: center;">
  <img src="https://raw.githubusercontent.com/Arshia-163/chat_app/master/Images/main.png" 
       alt="Main Page" width="60%" 
       style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);" />
</div>

## 🛠 𝐆𝐞𝐭𝐭𝐢𝐧𝐠 𝐒𝐭𝐚𝐫𝐭𝐞𝐝
=
1. **🍴 Fork the repository **
2. ** 💻 Clone your fork **
    - Clone the repository to your local machine by running the following command in your terminal:
     ```bash
     git clone https://github.com/your-username/CHAT_APP.git
          ```
   - Replace `your-username` with your GitHub username.
3. **🌿 Install backend dependencies**
     ```bash
     cd backend
     npm install
     ```
4. **🛠️ Set environment variables **
     PORT=5000
     MONGO_URI=<Your MongoDB URI>
     JWT_SECRET=<Your JWT Secret>
     
5. **Install frontend dependencies & Run **
    ```bash
    cd ../frontend
    npm install
    npm run dev
  ```


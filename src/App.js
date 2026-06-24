import './App.css';
import ClientSide from './client/ClientSide';
import FormValidation from './client/Form/FormValidation';
import SignIn from './client/Form/SignIn'
import MyContext from './Requierment/MyContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
  <MyContext>
    <div className="App">
     <h1>my chat App</h1>
   
     {/* <ClientSide roomId={1}/>
       <FormValidation/>
      <SignIn/> */}
      {/* برای تست چت 
      roomID برای 
      props 
      کامپوننت Clienside رو 1 گذاشتم */}
      
    </div>
     <Router>
      <Routes>
          <Route path="/chat" element={<ClientSide />}/>
            <Route path="/" element={<FormValidation />}/>
            <Route path="/Signin" element={<SignIn />}/>
      </Routes> 
    </Router>
    
    </MyContext>
   
    </>
  );
}

export default App;
//at firs we create  server-side file for socket.io as server.js file in server folder
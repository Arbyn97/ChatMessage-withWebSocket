import {  FaSearch} from "react-icons/fa";
import { useState,useEffect } from "react";


function Contacts({ userId, setRoomId }) {
     const [newUser,setNewUser]=useState('initial')
     const [contactList,setContactList]=useState([])
       const [searchvisible,setSearchvisible]=useState('none')
      const [contactvisible,setContactvisible]=useState('block')
const [nullVal,setNullVal]=useState('');
     //////////////////////////////////////////////////////////
     ////////////////پیدا کردن کسی که میخواهیم باهاش چت کنیم از دیتابیس
     ////////////////////////////////////////////////////////////
    const searchUser= async(username)=>{

     if (username.trim() === "") {
    setNewUser("initial");  // یا می‌تونی null بذاری، ولی باید JSX رو تنظیم کنی
    return;                 // از ادامه جستجو جلوگیری کن
  }

    try{
      const result= await fetch('http://localhost:4000/api/search',{
        method:'POST',
        headers:{
           'Content-Type': 'application/json',
        },
        body:JSON.stringify({username:username})
      })

      const Data=await result.json();
      if(result.ok && Data.userfound){

        setNewUser(Data.userfound)
      
      }
      else{
        setNewUser(null);  
      }
    }
    catch(error){
      console.log("something is wrong",error)
    }

  }
  //////////////////////////////////////////////////////
  ////////////////////////////////اضافه کردن کاربر
  //////////////////////////////////////////////////////
  const addToContactList=async(user)=>{
     if (contactList.includes(user)) {
    alert("این مخاطب قبلاً اضافه شده است");
    return;  // ادامه کار رو متوقف کن
  }
    setContactList([...contactList,user]);
    
    
    const response=await fetch('http://localhost:4000/api/addcontact',{
        method:'POST',
        headers:{
           'Content-Type': 'application/json',
        },
        body:JSON.stringify({contact:user,id:userId})
    })
    if(response.ok){
      alert("مخاطب اضافه شد");
      setNullVal('');
        setNewUser('initial');

    }
    else{
      alert("خطایی رخ داد بررسی کنید");
    }
     setSearchvisible('none');
     setContactvisible('block');
  }
  ///////////////////////////////          /////////////////////////////////////
  ///////////////////////////////useEffect/////////////////////////////////////
  //////////////////////////////          ///////////////////////////////////
  /////////////////////////////////مخاطب فراخوانی از دیتابیس
  /////////////////////////////////////////////////////////////////////////////
  useEffect(()=>
        {
          const userLogeIn=userId
 const fetchData = async () => {
    try { 
      const response = await fetch('http://localhost:4000/api/searchcontact',{
        method:'POST',
        headers:{
           'Content-Type': 'application/json',
        },
        body:JSON.stringify({id:userLogeIn})
      });
      
      const data = await response.json();
   
      if(data.contactList){
        setContactList(data.contactList);

      }
      else{
        setContactList([])
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (userId) fetchData();
     
         
      },[userId]);
      //////////////////////////////////////////////////
      //////////////////////////////باز کردن چت
      /////////////////////////////////////////////////
  const connectTochat=(contact)=>{
      
  const users = [userId, contact].sort();  
  const newRoomId = users.join('_');
  setRoomId(newRoomId);
    console.log("✅ Creating room with:", userId, contact);
    }





  /////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
    return (
        <>
        <div className="Mycontacts">
       <h3> My Contact</h3>
       <div className="search">
        <input type="text" placeholder="Search" onChange={e=>{searchUser(e.target.value); setNullVal(e.target.value);}} value={nullVal} 
        onFocus={()=>{setContactvisible('none');setSearchvisible('block')}}  
        onBlur={() => {
  setTimeout(() => {
    setContactvisible('block');
    setSearchvisible('none');
  }, 150); // 150ms معمولاً کافی‌ست
}} />

          <span ><FaSearch size={18} color="#e75cc9ff"/></span>
       </div>
       <div className="searched" style={{display:searchvisible}}>
        searched contact
     {newUser === "initial" ? (
    ""
  ) : newUser ? (
    // <p>{JSON.stringify(newUser, null, 2)}</p>
    <p onClick={()=>addToContactList(newUser)} className="founded">{newUser}</p>
    
  ) : (
   <p>پیدا نشد</p>
  )}
       </div>
       <div className="allcontact" style={{display:contactvisible}}>
        {/* all contact  */}
   <div>   {contactList? contactList.map((contact, index) => (<p className="contact" key={index} onClick={()=>{connectTochat(contact)}}>{contact}</p>)): <p>هیچ مخاطبی ندارید</p>}</div>
       </div>
      </div>
        </>
    );
}

export default Contacts;
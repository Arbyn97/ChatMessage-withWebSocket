
import { useEffect,useState } from "react";
import { useSocket,useSession } from "../Requierment/MyContext";
import { BsFillSendFill, BsTrash} from "react-icons/bs";

import { useSearchParams } from 'react-router-dom';




import Contacts from "./Contacts";
function ClientSide() {
    
    const [message,setMessage]=useState([])
    const [text,setText]=useState('')
    
    const [roomId, setRoomId] = useState(null);
    const sessionId = useSession();

    const [searchParams] = useSearchParams();
    
    //userID 
    ////مربوط به شخصیه که به صفحه چت خودش لاگین میکنه
    const userId = searchParams.get('userId');
    console.log("User ID:", userId);

    const socket=useSocket()
    console.log("Socket is:", socket);
    
    
    useEffect(()=>
      {

        
         if (!socket || !roomId) return;
            setMessage([]);  // وقتی روم عوض شد پیام‌ها پاک بشن


        console.log(roomId)
    // وارد شدن به روم
    socket.emit("join room", roomId);

        
  // درخواست همه پیام‌های قبلی
      socket.emit('recived', { roomId });

      // socket.emit('recived',{roomId});
        socket.on('all messages', (msg) => {
      setMessage(msg);
     
      
    });

 
  // شنیدن پیام جدید
     
      socket.on('message', (msg) => {
         if(msg.roomId === roomId) {
      setMessage(prev => [...prev, msg]);
      }
    });

   
     return () => {
      socket.off('all messages');
      socket.off('message');
     
    };
    },[socket,roomId]);
  
   
    const Send=(e)=>
      {
      
       e.preventDefault()
      
       if (text.trim() === '') return; // جلوگیری از ارسال پیام خالی
       socket.emit('message',{roomId,message:text,userId:sessionId} );
       setText('')
         
      }
   
 if (!socket) {
    return <div>⏳ در حال اتصال به سرور چت...</div>;
  }
  const hndleDelete=async (e,id)=>{
    e.preventDefault();
    try{
      const response=await fetch('http://localhost:4000/api/delete',{
         method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:id }),
      })
      

      if (response.ok) {
  setMessage(prev => prev.filter(m => m._id !== id));

      } else {
       console.log('a problem')
      }
    }
    catch{ console.log('some problem')}
  }

    return ( 
       
    <> 
    <div className="Home">
      <Contacts userId={userId}  setRoomId={setRoomId}/>
     
      <div className="chat">
          <h2>{roomId}</h2>
          <div className="messages">
            {message.map((msg) => (
              <div  key={msg._id || Math.random()}  className={msg.userId === sessionId ? "message-own" : "message-other"}>
                 {msg.Text}
              
                 <span className="icon" onClick={(e)=>hndleDelete(e,msg._id,msg.Text)}>< BsTrash color="#5b71afff"/></span>
               
              </div>
          
               ))
            }
                        {/* {roomId?(
              message.map((msg) => (
              <div  key={msg._id || Math.random()}  className={msg.userId === sessionId ? "message-own" : "message-other"}>
                 {msg.Text}
              
                 <span className="icon" onClick={(e)=>hndleDelete(e,msg._id,msg.Text)}>< BsTrash color="brown"/></span>
               
              </div>
          
               ))
            ):  <p>لطفاً یک مخاطب را انتخاب کنید</p>
            } */}
       
          </div>
        <div className="sendmessage">
          <textarea placeholder="type anything..." rows={3}
            onChange={(e)=>setText(e.target.value)} value={text}
            onKeyDown={(e) => {
    if (e.key === 'Enter' && e.shiftKey) {  // Shift + Enter
      e.preventDefault();  // جلوی خط جدید رو بگیر
      Send(e);             // ارسال پیام
    }
    // Enter ساده اجازه خط جدید میده
  }}
            />

          <button onClick={Send}><BsFillSendFill  color="#e75cc9ff"  size={20}/></button>
          </div>
      </div>
      
      </div>
     </>
     );
}

export default ClientSide;
//at first we import  io in project for establish connection between client and server
//and listen to port for connection
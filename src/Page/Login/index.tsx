import { message } from 'antd';
import { useState } from 'react';
import agent from '../../App/Api';
import { useNavigate } from "react-router-dom";
import './index.css'
type LoginProps = {}
 
const Login:React.FC<LoginProps> = () => {
  const [login, setlogin] = useState<{email:string, password:string}>({email:'', password:''})
  let navigate = useNavigate();
function setInput(e:any){
  setlogin({...login , [e.target.name]: e.target.value })
}
async function FormSubmit(e:any) {
e.preventDefault()
  if (!Object.values(login).some(x => x === null || x === '')) {
    const res = await agent.Login(login)
    res&&localStorage.setItem('agent',res.token)
return navigate('/')
  }else{
    message.error("The fields are required !");
    
  }
}
    return (
<div className="login-page">
  <div className="form" onSubmit={FormSubmit}>
    <form className="login-form">
      <input type="text" placeholder="username" name='email' onChange={(e)=>setInput(e)}/>
      <input type="password" placeholder="password" name='password' onChange={(e)=>setInput(e)}/>
      <button>login</button>
    </form>
  </div>
</div>
    );
}
 
 
export default Login;
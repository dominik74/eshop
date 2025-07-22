import s from '../../less/auth.module.less'
import * as authApi from '../../api/auth'
import type { User } from '../../types/User';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_AUTH_TOKEN } from '../../constants';
import { useEffect, useRef } from 'react';

interface Props {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  isLoginPage: boolean;
}

export default function AuthPage(props: Props) {
    const navigate = useNavigate();
    const firstInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
      firstInputRef.current?.focus();
    }, []);
  
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      
      const formData = new FormData(event.currentTarget);
      
      const username = formData.get('username') as string;
      const password = formData.get('password') as string;
      const passwordRepeat = formData.get('passwordRepeat') as string;
      
      if (!username || !password) {
        // todo: this is a local error, so should we differentiate that from
        // a server error? and here goes the abstraction
        props.setErrorMessage('username and password are required');
        return;
      }
      
      if (!props.isLoginPage && !passwordRepeat) {
        // todo: this is a local error, so should we differentiate that from
        // a server error? and here goes the abstraction
        props.setErrorMessage('password confirmation is required');
        return;
      }
      
      if (!props.isLoginPage && password !== passwordRepeat) {
        // todo: this is a local error, so should we differentiate that from
        // a server error? and here goes the abstraction
        props.setErrorMessage('passwords do not match');
        return;
      }
      
      if (!props.isLoginPage && password === username) {
        // todo: this is a local error, so should we differentiate that from
        // a server error? and here goes the abstraction
        props.setErrorMessage('password must not match username');
        return;
      }
      
      try {
        let jwtResp;
        
        if (props.isLoginPage) {
          jwtResp = await authApi.login(username, password);
        } else {
          jwtResp = await authApi.register(username, password, passwordRepeat);
        }
          
        const user = await authApi.getUserDetails(jwtResp.token);
        props.setUser(user);
        
        localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, jwtResp.token);
        
        props.setErrorMessage('');
        navigate('/');
      } catch (e) {
        if (e instanceof Error) {
          props.setErrorMessage(e.message);
        }
      }
    }
    
    function switchAuthMethod(e: React.MouseEvent) {
      e.preventDefault();
      navigate(props.isLoginPage ? "/register" : "/login");
    }
  
    return (
      <div className={s.component}>
        <form onSubmit={handleSubmit}>
          <label>
            <span>username or email</span>
            <input ref={firstInputRef} type="text" name="username" className={s.special} required />
          </label>
          
          <label>
            <span>password</span>
            <input type="password" name="password" required />
          </label>
          
          {!props.isLoginPage &&
            <label>
              <span>repeat password</span>
              <input type="password" name="passwordRepeat" />
            </label>
          }
          
          <div className={s.buttonbar}>
            <button onClick={switchAuthMethod} tabIndex={1}>{props.isLoginPage ? "register..." : "login..."}</button>
            <input type="submit" value={props.isLoginPage ? "login" : "register"} />
          </div>
        </form>
        
      </div>
    );
}
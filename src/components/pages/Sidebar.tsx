import { Link } from 'react-router-dom';
import s from '../../less/sidebar.module.less'
import { useEffect, useRef } from 'react';
import { LOCAL_STORAGE_AUTH_TOKEN } from '../../constants';
import type { User } from '../../types/User';

interface Props {
    setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | undefined;
}

export default function Sidebar(props: Props) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if ( sidebarRef.current && !sidebarRef.current.contains(event.target as Node)
            ) {
                close();
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);
    
    function close() {
        props.setIsSidebarVisible(false);
    }
    
    function logout() {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
        window.location.reload();
    }
    
    return (
        <div className={s.component} ref={sidebarRef}>
            <div className={s.topbar}>
                <button onClick={close}>X</button>
            </div>
            
            <ul>
                <li><Link to="/" onClick={close}>home</Link></li>
                <li><Link to="/login" onClick={close}>login</Link></li>
                <li><Link to="/cart" onClick={close}>cart</Link></li>
                
                {props.user &&
                    <li><Link to="" onClick={logout}>logout</Link></li>
                }
            </ul>
        </div>
    )
}
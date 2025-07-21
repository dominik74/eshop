import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    setIsFooterPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RedirectListener(props: Props) {
    const location = useLocation();
    
    useEffect(() => {
        props.setErrorMessage('');
        
        if (location.pathname !== '/search') {
            props.setSearchValue('');
        }
        
        props.setIsFooterPage(!(
            location.pathname === '/login' ||
            location.pathname === '/register'
        ));
    }, [location.pathname]);
    
    return null;
}
  
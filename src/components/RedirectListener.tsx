import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function RedirectListener(props: Props) {
    const location = useLocation();
    
    useEffect(() => {
        props.setErrorMessage('');
        
        if (location.pathname !== '/search') {
            props.setSearchValue('');
        }
    }, [location.pathname]);
    
    return null;
}
  
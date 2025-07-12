import { Link, useNavigate } from "react-router-dom";
import s from '../less/nav.module.less'
import * as prodApi from "../api/products";
import { useEffect, useRef, useState } from "react";
import type { Product } from "../types/Product";
import type { User } from "../types/User";
import { LOCAL_STORAGE_AUTH_TOKEN } from "../constants";

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    user: User | undefined;
}

export default function Navbar(props: Props) {
    const [productResults, setProductResults] = useState<Product[] | undefined>();
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState<number>(-1);
    
    const searchboxRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLUListElement>(null);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if ( suggestionsRef.current && !suggestionsRef.current.contains(event.currentTarget as Node) &&
                searchboxRef.current && !searchboxRef.current.contains(event.currentTarget as Node)
            ) {
                setProductResults([]);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);
    
    function searchboxKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
        }
    }
    
    async function searchboxKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.currentTarget.value.length <= 2) {
            setProductResults([]);
            setSelectedSuggestionIdx(-1);
            return;
        }
        
        if (productResults && (
            event.key === 'ArrowUp' ||
            event.key === 'ArrowDown'
        )) {
            let newIdx = event.key === 'ArrowUp' ?
                selectedSuggestionIdx - 1 :
                selectedSuggestionIdx + 1;
                
            if (newIdx < 0) {
                newIdx = productResults?.length - 1;
            } else if (newIdx > productResults?.length - 1) {
                newIdx = 0;
            }
            
            setSelectedSuggestionIdx(newIdx);
            return;
        }
        
        if (productResults && event.key === 'Enter') {
            if (selectedSuggestionIdx >= 0) {
                acceptSuggestion(productResults[selectedSuggestionIdx].id);
            } else {
                navigate('/search?q=' + event.currentTarget.value);
                setProductResults([]);
                setSearchValue('');
            }
            
            return;
        }
        
        try {
            const products = await prodApi.searchProducts(event.currentTarget.value);
            setProductResults(products);
        } catch (e) {
            if (e instanceof Error) {
                props.setErrorMessage(e.message);
            }
        }
    }
    
    function acceptSuggestion(prodId?: number) {
        navigate('/product/' + prodId);
        setProductResults([]);
        setSearchValue('');
        setSelectedSuggestionIdx(-1);
    }
    
    function logout() {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
        window.location.reload();
    }
    
    return (
        <div className={s.component}>
            <nav>
                <Link to="/">home</Link>
                <Link to="/add_product">add product</Link>
                <Link to="/login">login</Link>
                <Link to="/cart">cart</Link>
                
                <div className={s.right}>
                    <span>
                        {props.user?.username}
                        {props.user?.admin &&
                            ' (admin)'
                        }
                    </span>
                    
                    {props.user &&
                        <button onClick={logout}>log out</button>
                    }
                    <div className={s.searchbox}>
                        <input
                            type="text"
                            onKeyUp={searchboxKeyUp}
                            onKeyDown={searchboxKeyDown}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="search product..."
                            ref={searchboxRef}
                        />
                        
                        {productResults && productResults.length > 0 &&
                            <ul
                                className={s.suggestions}
                                ref={suggestionsRef}
                            >
                                {productResults.map((prod, i) => (
                                    <li
                                        className={`${s.sugItem} ${selectedSuggestionIdx === i && s.sel}`}
                                        onClick={() => acceptSuggestion(prod.id)}
                                        key={i}
                                    >
                                        {prod.name}
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
                    <h3>shoppingo</h3>
                </div>
            </nav> 
        </div>
    );
}
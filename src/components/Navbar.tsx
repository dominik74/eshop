import { Link, useNavigate } from "react-router-dom";
import s from '../less/nav.module.less'
import * as prodApi from "../api/products";
import { useEffect, useRef, useState } from "react";
import type { Product } from "../types/Product";
import type { User } from "../types/User";
import { LOCAL_STORAGE_AUTH_TOKEN } from "../constants";

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    user: User | undefined;
    setIsSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar(props: Props) {
    const MIN_INPUT_LENGTH = 3;
    
    const [productResults, setProductResults] = useState<Product[] | undefined>();
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
        if (event.currentTarget.value.length < MIN_INPUT_LENGTH) {
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
                search();
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
        props.setSearchValue('');
        setSelectedSuggestionIdx(-1);
    }
    
    function logout() {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
        window.location.reload();
    }
    
    function search() {
        navigate('/search?q=' + props.searchValue);
        setProductResults([]);
    }
    
    return (
        <div className={s.component}>
            <nav>
                <div className={s.leftSide}>
                    <Link to="/" className={s.specialLink}>shoppingo</Link>
                
                    {props.user && props.user.admin &&
                        <Link to="/add_product">add product</Link>
                    }
                    
                    <Link to="/login">login</Link>
                    <Link to="/cart">cart</Link>
                </div>
                
                <button
                    className={s.menuBtn}
                    onClick={() => props.setIsSidebarVisible(true)}
                >
                    <img src="hamburger_menu.png" />
                </button>
                
                <div className={s.searchbox}>
                    <input
                        type="text"
                        onKeyUp={searchboxKeyUp}
                        onKeyDown={searchboxKeyDown}
                        value={props.searchValue}
                        onChange={(e) => props.setSearchValue(e.target.value)}
                        placeholder="Search products..."
                        ref={searchboxRef}
                    />
                    
                    <img src="search_icon.png" />
                    
                    <button
                        disabled={props.searchValue.length < MIN_INPUT_LENGTH}
                        onClick={search}
                    >
                        &#10141;
                    </button>
                    
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
                
                <div className={s.rightSide}>
                    <span>
                        {props.user?.username}
                        {props.user?.admin &&
                            ' (admin)'
                        }
                        
                        {/* for testing */}
                        {props.user &&
                            ', money: ' + props.user?.money
                        }
                    </span>
                    
                    {props.user &&
                        <button onClick={logout}>log out</button>
                    }
                </div>
            </nav> 
        </div>
    );
}
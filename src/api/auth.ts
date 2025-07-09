import { API_URL } from "../constants";
import type { JwtResponse } from "../types/dtos/JwtResponse";
import type { User } from "../types/User";

export async function register(username: string, password: string, passwordRepeat: string): Promise<JwtResponse> {
    const resp = await fetch(API_URL + '/auth/register', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ username, password, passwordRepeat })
    });
    
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
    
    const jwtResp = await resp.json();
    
    if (!jwtResp) {
        throw new Error('invalid data received from server');
    }
    
    return jwtResp;
}

export async function login(username: string, password: string): Promise<JwtResponse> {
    const resp = await fetch(API_URL + '/auth/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ username, password })
    });
    
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
    
    const jwtResp = await resp.json();
    
    if (!jwtResp) {
        throw new Error('invalid data received from server');
    }
    
    return jwtResp;
}

export async function getUserDetails(token: string): Promise<User> {
    const resp = await fetch(API_URL + "/auth/me", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!resp.ok) {
        throw new Error(`${resp.status}: ${await resp.text()}`);
    }
    
    const user = await resp.json();
    console.log('details:');
    console.log(user);
    
    if (!user) {
        throw new Error('invalid data received from server');
    }
    
    return user;
}
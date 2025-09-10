import React, { createContext, useContext, useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../services/storage';


const USERS_KEY = 'app_users_v1';
const SESSION_KEY = 'app_session_v1';
const AuthContext = createContext();


export function useAuth(){ return useContext(AuthContext); }


export default function AuthProvider({ children }){
const [users, setUsers] = useState(() => readJSON(USERS_KEY, []));
const [session, setSession] = useState(() => readJSON(SESSION_KEY, null));


useEffect(() => writeJSON(USERS_KEY, users), [users]);
useEffect(() => writeJSON(SESSION_KEY, session), [session]);


function signup({ name, email, password }){
if (users.find(u=>u.email===email)) return { ok:false, message:'Email exists' };
const newUser = { id: Date.now().toString(), name, email, password, avatar:null };
setUsers(prev=>[...prev, newUser]);
setSession({ id: newUser.id });
return { ok:true };
}


function login({ email, password }){
const user = users.find(u=>u.email===email && u.password===password);
if (!user) return { ok:false, message:'Invalid credentials' };
setSession({ id: user.id });
return { ok:true };
}


function logout(){ setSession(null); }


function updateProfile(id, patch){ setUsers(prev => prev.map(u=>u.id===id?{...u,...patch}:u)); }


const value = { users, session, signup, login, logout, updateProfile, currentUser: users.find(u=>u.id===session?.id) };
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
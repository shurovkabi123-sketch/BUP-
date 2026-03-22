import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (studentId: string, password: string) => Promise<void>;
  register: (studentId: string, password: string, displayName: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (studentId: string, password: string) => {
    // We use a virtual email for Firebase Auth: studentId@bup.edu.bd
    const trimmedId = studentId.trim().toLowerCase();
    const email = `${trimmedId}@bup.edu.bd`;
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (studentId: string, password: string, displayName: string, email: string) => {
    const trimmedId = studentId.trim().toLowerCase();
    const virtualEmail = `${trimmedId}@bup.edu.bd`;
    const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, password);
    const firebaseUser = userCredential.user;

    // Automatically make the owner an admin
    const role = email.toLowerCase().trim() === 'shurovkabi123@gmail.com' ? 'admin' : 'student';

    const newProfile: UserProfile = {
      uid: firebaseUser.uid,
      displayName: displayName.trim(),
      email: email.trim(), // Real contact email
      studentId: trimmedId,
      role,
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
    setProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

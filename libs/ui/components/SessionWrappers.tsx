"use client"
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from 'react';

interface SessionWrapperProps {
  children: ReactNode
}

const SessionWrapper = ({children} :SessionWrapperProps ) => {
  return (
    
      <SessionProvider> {children}</SessionProvider>
   
  )
}

export default SessionWrapper

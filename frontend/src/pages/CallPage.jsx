import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api'

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast'
import TextEditor from '../components/TextEditor'

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {
  const {id:callId}=useParams()
  const [client,setClient]=useState(null)
  const [call,setCall]=useState(null)
  const [isConnecting,setIsConnecting]=useState(true)

  const {authUser,isLoading}=useAuthUser()

  const {data:tokenData}=useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled: !!authUser
  })

  useEffect(()=>{
    const initCall=async ()=>{
      if(!tokenData || !tokenData.token || !callId) return

      try {
        console.log("Initializing stream video calling");

        const user={
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic
        }

        const videoClient=new StreamVideoClient({
          apiKey:STREAM_API_KEY,
          user,
          token:tokenData.token
        })

        const callInstance=videoClient.call("default",callId)

        await callInstance.join({create:true})
        
        console.log("Joined call successfully");

        setClient(videoClient)
        setCall(callInstance)

      } catch (error) {
        console.log("Error joining the call",error);
        toast.error("Could not join the call. Please try again")
      } finally{
        setIsConnecting(false)
      }
    }

    initCall()
  },[tokenData,authUser,callId])

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='relative grid grid-cols-2 gap-4 p-4'>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent/>
            </StreamCall>
          </StreamVideo>
        ):(
          <div className='flex items-center justify-center h-full'>
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
        <div className='overflow-y-scroll h-[60vh] border border-white'>
          <TextEditor/>
        </div>
      </div>
    </div>
  )
}

const CallContent=()=>{
  const {useCallCallingState} =useCallStateHooks()
  const callingState=useCallCallingState()

  const navigate=useNavigate()

  if(callingState===CallingState.LEFT) return navigate("/")
  return (
    <StreamTheme>
      <SpeakerLayout/>
      <CallControls/>
    </StreamTheme>
  )
}

export default CallPage
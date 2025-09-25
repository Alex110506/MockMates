import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api'
import ChatLoader from '../components/ChatLoader'
import CallButton from '../components/CallButton'

import{
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window
} from "stream-chat-react"

import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'

const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const {id:targetUserId}=useParams()

  const [chatClient,setChatClient]=useState(null)
  const [channel,setChannel]=useState(null)
  const [loading,setLoading]=useState(true)

  const {authUser}=useAuthUser()

  const {data:tokenData}=useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    enabled: !!authUser // run only when authUser is available
  })

  console.log(tokenData);

  useEffect(()=>{
    const initChat=async ()=>{
      if(!tokenData || !tokenData.token || !authUser) return

      try {
        console.log("initializing stream chat client");

        const client=StreamChat.getInstance(STREAM_API_KEY)

        await client.connectUser({
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic
        },tokenData.token)

        //create a channel by joining the id's
        const channelId=[authUser._id, targetUserId].sort().join("-")

        const currentChannel=client.channel("messaging",channelId,{
          members:[authUser._id,targetUserId]
        })

        await currentChannel.watch()

        setChatClient(client)
        setChannel(currentChannel)

      } catch (error) {
        console.log(error);
        toast.error("Could not connect to chat. Please try again")
      }finally{
        setLoading(false)
      }
    }

    initChat()
  },[tokenData,authUser,targetUserId])

  const handleVideoCall=()=>{
    if(channel){
      const callUrl=`${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`
      })

      toast.success("Video call link sent successfully!")
    }
  }

  if(loading || !chatClient || !channel) return <ChatLoader/>

  return (
    <div className='h-[93vh] bg-gradient-to-r from-[#1e315a] to-[#6271c2]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader/>
              <MessageList/>
              <MessageInput focus={true}/>
            </Window>
          </div>

          <Thread/>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
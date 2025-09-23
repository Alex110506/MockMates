import React from 'react'
import { Link } from 'react-router-dom'

const FriendCard = ({friend}) => {
  return (
    <div className='card bg-basse-200 hover:shadow-md transition-shadow'>
        <div className='card-body p-4'>
            <div className='flex items-center gap-3 mb-3'>
                <div className='avatar size-12'>
                    <img src={friend.profilePic} alt={friend.fullName} />
                </div>
                <h3 className='font-semibold truncate'>{friend.fullName}</h3>
            </div>

            <div className='flex flex-wrap gap-1.5 mb-3'>
                <span className='badge badge-secondary text-xs'>
                    <Location className="size-4"/>
                    {friend.country+", "+friend.city}
                </span>
                <span className='badge badge-outline text-xs'>
                    <IdCardLanyard className="size-4"/>
                    {friend.occupaation}
                </span>
            </div>

            <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
                Message
            </Link>
        </div>
    </div>
  )
}

export default FriendCard
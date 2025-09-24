import React from 'react'
import { Link } from 'react-router-dom'
import { IdCardLanyard,MapPin } from 'lucide-react'

const FriendCard = ({friend}) => {

    console.log(friend);
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
        <div className='card-body p-4'>
            <div className='flex items-center gap-3 mb-3'>
                <div className='avatar size-12'>
                    <img src={friend.profilePic} alt={friend.fullName} />
                </div>
                <h3 className='font-semibold truncate'>{friend.fullName}</h3>
            </div>

            <div className='flex flex-wrap gap-1.5 mb-3'>
                <span className='badge badge-secondary text-xs'>
                    <MapPin className="size-4"/>
                    {capitalizeFirstLetter(friend.country)+", "+capitalizeFirstLetter(friend.city)}
                </span>
                <span className='badge badge-outline text-xs'>
                    <IdCardLanyard className="size-4 mr-1"/>
                    {friend.occupation}
                </span>
            </div>

            <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
                Message
            </Link>
        </div>
    </div>
  )
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export default FriendCard
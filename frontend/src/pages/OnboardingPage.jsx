import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { completeOnboarding } from '../lib/api'
import { BrainCircuit, Camera, Loader, Shuffle } from 'lucide-react'
import { countries } from '../constants'

const OnboardingPage = () => {
  const {authUser}=useAuthUser()
  const queryClient=useQueryClient()

  const [formState,setFormState]=useState({
    fullName:authUser?.fullName || "",
    profilePic:authUser?.profilePic || "",
    bio:authUser?.bio || "",
    occupation:authUser?.occupation || "",
    country:authUser?.country || "",
    city:authUser.city || ""
  })

  const {mutate:onboardingMutation,isPending}=useMutation({
    mutationFn:completeOnboarding,
    onSuccess:()=>{
      toast.success("Profile onboarded successfully")
      queryClient.invalidateQueries({queryKey:["authUser"]})
    },
    onError:(error)=>{
      toast.error(error.response.data.message)
    }
  })

  const handleSubmit=(e)=>{
    e.preventDefault()
    onboardingMutation(formState)
  }

  const handleRandomAvatar=()=>{
    const idx=Math.floor(Math.random()*100)+1;
    const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`
    setFormState({...formState,profilePic:randomAvatar})
    toast.success("Avatar changed successfully")
  }

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* profile pic */}
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formState.profilePic ? (
                  <img src={formState?.profilePic} alt="Profile Preview" className='w-full h-full object-cover'/>
                ):(
                  <div className='flex items-center justify-center h-full'>
                    <Camera className='size-12 text-base-content opacity-40'></Camera>
                  </div>
                )}
              </div>

              {/* generate random avatar */}
              <div className='felx items-center gap-2'>
                <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
                  <Shuffle className='size-4 mr-2'></Shuffle>
                  Generate Random Avatar
                </button>
              </div>

              
            </div>
            {/* inputs fullname*/}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input type="text" 
                name='fullName'
                value={formState?.fullName}
                onChange={(e)=>setFormState({...formState,fullName:e.target.value})}
                className='input input-bordered w-full'
                placeholder='You full name'
              />
            </div>

            {/* bio input */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
              <textarea
                name='bio'
                value={formState?.bio}
                onChange={(e)=>setFormState({...formState,bio:e.target.value})}
                className='textarea textarea-bordered h-24'
                placeholder='Tell others about yourself and you career journey'
              />
            </div>

            {/* occupation input */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Occupation</span>
              </label>
              <input type="text" 
                name='occupation'
                value={formState?.occupation}
                onChange={(e)=>setFormState({...formState,occupation:e.target.value})}
                className='input input-bordered w-full'
                placeholder='e.g. Student, Full-stack Developer, Data Analyst'
              />
            </div>

            {/* location inputs */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Country</span>
                </label>
                <select name="country"
                  value={formState.country}
                  onChange={(e)=>setFormState({...formState,country:e.target.value})}
                  className='select select-bordered w-full'
                >
                  <option value="">Select your country</option>
                  {countries.map((country)=>
                    <option key={`${country}`} value={country.toLocaleLowerCase()}>
                      {country}
                    </option>
                  )}
                </select>
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>City</span>
                </label>
                <input type="text" 
                  name='city'
                  value={formState?.city}
                  onChange={(e)=>setFormState({...formState,city:e.target.value})}
                  className='input input-bordered w-full'
                  placeholder='Type your city'
                />
              </div>
            </div>

            {/* submit button */}

            <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
              {!isPending ? (
                <>
                  <BrainCircuit className='size-5'></BrainCircuit>
                  <span className='text-lg font-semibold'>Complete Onboarding</span>
                </>
              ): (
                <>
                  <Loader className='size-5 mr-2 animate-spin'></Loader>
                  <span className='text-lg font-semibold'>Onboarding...</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
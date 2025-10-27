import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)

    const submitHander = async (e) => {
        e.preventDefault()
        setIsVerifying(true)
        setError('')

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: props.ride._id,
                    otp: otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                // Update ride status to ongoing
                const updatedRide = { ...props.ride, status: 'ongoing' }
                console.log('Ride status updated:', updatedRide)
                
                // Emit socket event to update ride status
                socket.emit('ride-status-updated', updatedRide)
                
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: updatedRide } })
            }
        } catch (error) {
            console.error('Error starting ride:', error)
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.')
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <div className='fixed bottom-0 left-0 right-0 bg-white z-50 p-5 rounded-t-3xl shadow-lg h-[90vh] flex flex-col overflow-y-auto'>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold my-5'>Confirm Ride to Start</h3>
            <div className='flex items-center justify-between p-3 border-2  mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://st2.depositphotos.com/5934840/11417/v/450/depositphotos_114179902-stock-illustration-simple-person-pictogram.jpg" alt="" />
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>₹{props.ride?.fare}</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup Location</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-xl ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                        </div>
                    </div>
                </div>

                <div className='mt-6 w-full'>
                    <form onSubmit={submitHander}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP from passenger
                            </label>
                            <input 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                type="text" 
                                className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full' 
                                placeholder='Enter 6-digit OTP' 
                                maxLength="6"
                                required
                            />
                        </div>
                        
                        {error && (
                            <div className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={isVerifying || !otp || otp.length !== 6}
                            className={`w-full text-lg flex justify-center text-white font-semibold p-3 rounded-lg ${
                                isVerifying || !otp || otp.length !== 6 ? 'bg-gray-400' : 'bg-green-600'
                            }`}
                        >
                            {isVerifying ? 'Verifying OTP...' : 'Confirm & Start Ride'}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => {
                                props.setConfirmRidePopupPanel(false)
                                props.setRidePopupPanel(false)
                            }} 
                            className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'
                        >
                            Cancel Ride
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp
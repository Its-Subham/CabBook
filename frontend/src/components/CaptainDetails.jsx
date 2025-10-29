
import React, { useContext, useState, useEffect } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainDetails = ({ refreshTrigger = 0 }) => {
    const { captain } = useContext(CaptainDataContext)
    const [stats, setStats] = useState({
        dailyHours: 0,
        totalHours: 0,
        dailyEarnings: 0,
        totalEarnings: 0,
        todayRides: 0,
        totalRides: 0,
        isOnline: false
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCaptainStats()
        
        // Refresh stats every 30 seconds
        const interval = setInterval(fetchCaptainStats, 100000)
        
        return () => clearInterval(interval)
    }, [])

    // Listen for refresh trigger from parent component
    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchCaptainStats()
        }
    }, [refreshTrigger])

    const fetchCaptainStats = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/stats`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log("Captain Stats", response.data);
            console.log("Is Online from API:", response.data.isOnline);
            console.log("Status from API:", response.data.status);
            setStats(response.data)
        } catch (error) {
            console.error('Error fetching captain stats:', error)
            console.error('Error details:', error.response?.data)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center h-32'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
        )
    }

    return (
        <div className='pb-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://st2.depositphotos.com/5934840/11417/v/450/depositphotos_114179902-stock-illustration-simple-person-pictogram.jpg" alt="" />
                    <div>
                        <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                        <div className='flex items-center gap-1'>
                            <div className={`w-2 h-2 rounded-full ${stats.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className='text-xs text-gray-600'>{stats.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹{stats.dailyEarnings.toFixed(2)}</h4>
                    <p className='text-sm text-gray-600'>Today's Earnings</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>{stats.dailyHours.toFixed(1)}</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                    <p className='text-sm text-gray-600'>Today</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>{stats.totalHours.toFixed(1)}</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                    <p className='text-sm text-gray-600'>Total</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>₹{stats.totalEarnings.toFixed(2)}</h5>
                    <p className='text-sm text-gray-600'>Total Earned</p>
                    <p className='text-sm text-gray-600'>Lifetime</p>
                </div>
            </div>
            
            {/* Additional stats row */}
            <div className='flex p-3 mt-4 bg-blue-50 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-2xl mb-2 font-thin ri-riding-line"></i>
                    <h5 className='text-lg font-medium'>{stats.todayRides}</h5>
                    <p className='text-sm text-gray-600'>Rides Today</p>
                </div>
                <div className='text-center'>
                    <i className="text-2xl mb-2 font-thin ri-road-map-line"></i>
                    <h5 className='text-lg font-medium'>{stats.totalRides}</h5>
                    <p className='text-sm text-gray-600'>Total Rides</p>
                </div>
                <div className='text-center'>
                    <i className="text-2xl mb-2 font-thin ri-money-dollar-circle-line"></i>
                    <h5 className='text-lg font-medium'>₹{(stats.totalEarnings / Math.max(stats.totalRides, 1)).toFixed(2)}</h5>
                    <p className='text-sm text-gray-600'>Avg per Ride</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails
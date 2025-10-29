import PropTypes from 'prop-types'

const ConfirmRide = (props) => {
    // Define vehicle images mapping
    const vehicleImages = {
        car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
        moto: "https://tse4.mm.bing.net/th/id/OIP.znY96OhfmQ9RecEw45FS_AHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
        auto: "https://tse1.mm.bing.net/th/id/OIP.KWeFvWGG3qriaNus_3iw-AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
    };

    return (
        <div className='min-h-[60vh] flex flex-col'>
            <h5 className='p-1 text-center w-[93%] absolute top-0 z-10' onClick={() => {
                props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5 mt-2'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center flex-1'>
                <img 
                    className='h-20' 
                    src={vehicleImages[props.vehicleType] || vehicleImages.car} 
                    alt={`${props.vehicleType} vehicle`} 
                />
                <div className='w-full mt-5 flex-1'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div className='flex-1 min-w-0'>
                            <h3 className='text-lg font-medium'>Pickup Location</h3>
                            <p className='text-sm -mt-1 text-gray-600 break-words'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div className='flex-1 min-w-0'>
                            <h3 className='text-lg font-medium'>Destination Location</h3>
                            <p className='text-sm -mt-1 text-gray-600 break-words'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.fare[ props.vehicleType ]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Amount: Cash</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.createRide()

                }} className='w-full mt-5 mb-4 bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition-colors'>Confirm</button>
            </div>
        </div>
    )
}

ConfirmRide.propTypes = {
    setConfirmRidePanel: PropTypes.func.isRequired,
    vehicleType: PropTypes.string.isRequired,
    pickup: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired,
    fare: PropTypes.object.isRequired,
    setVehicleFound: PropTypes.func.isRequired,
    createRide: PropTypes.func.isRequired
}

export default ConfirmRide
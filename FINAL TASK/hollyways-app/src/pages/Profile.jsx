import Navbar from '../components/Navbar'
import '../css/Profile.css'
import { UserContext } from '../context/userContext';
import { useContext } from 'react';
import moment from 'moment'



import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Aos from 'aos';

export default function Profile() {

    const [state, dispatch] = useContext(UserContext)

    console.log(state);


    useEffect(() => {
        Aos.init({
            once: true,
            duration: 900,
            delay: 300,
        }, [])
    })


    console.log(state);


    return (
        <>
            <Navbar />
            <div data-aos="fade-up-left" className="d-flex containerProfile">
                <div data-aos="fade-right" className='leftContent'>
                    <div className="topLeftContent">
                        <h1>My Profile</h1>
                    </div>

                    <div className='d-flex detailLeftProfile'>
                        <div className="imageProfile">

                            {state.user.profile.image === undefined || state.user.profile.image === null || state.user.profile.image === "" ? (
                                // <img width={"150px"} height={"150px"} src='https://www.pngwing.com/en/free-png-bvbry' alt="none" />
                                <img width={"150px"} height={"150px"} src="https://res.cloudinary.com/dfdoyoati/image/upload/v1679816463/database/undefined_b9d8tr.png" alt="Google logo" />

                            ) : (
                                <img width={"150px"} height={"150px"} src={state.user.profile.image} alt="" />
                            )

                            }


                        </div>
                        <div className="detailProfile">
                            <div className='detailProfileTitle'>
                                <h5>Full Name</h5>
                            </div>
                            <p>{state.user.name}</p>
                            <div className='detailProfileTitle'>
                                <h5>Email</h5>
                            </div>
                            <p>{state.user.email}</p>
                            <div className='detailProfileTitle'>
                                <h5>Phone</h5>
                            </div>
                            <p>{state.user.profile.phone}</p>
                        </div>

                    </div>
                </div>
                <div data-aos="fade-up-left" className='rightContent'>
                    <div className="rightContentTop">
                        <h1>History Donation</h1>
                    </div>

                    <div className="historyDonationRight">
                        {state.user.donated.map((item) => (
                            <div className="cardHistoryDonation">
                                <div className="innerCardHistoryDonation">
                                    <h6>{item.titleattache}</h6>
                                    <h6>{moment(item.donatedTime).format('DD-MM-YYYY')}</h6>
                                    <div className="totalHistoryDonation">
                                        <p>Total : Rp{item.donated.toLocaleString()} </p>
                                    </div>

                                    <div className="d-flex footerCardHistoryDonation">

                                        {item.status === "success" ?
                                            <button className='statusHistoryDonation' > {item.status}</button> :
                                            <button className='statusHistoryDonationDidntSucces'  > {item.status}</button>}

                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>










                </div>
            </div>
        </>
    )
}
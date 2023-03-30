import '../css/LoadingStyle.css'
import 'animate.css';
import Aos from 'aos';
import { useEffect } from 'react';

export default function Loading() {


    useEffect(() => {
        Aos.init({
            once: true,
            duration: 900,
            delay: 300,
        }, [])
    })



    return (
        <>
            <div className="mainContainer">
                <div data-aos="fade-down" className='innerMainContainer'>
                    <h1 className=' animate__animated animate__backInDown animate__delay-0.5s '>While you are still standing, try to reach out to the people who are falling.</h1>
                    <div className='d-flex anim'>
                        <div data-aos="fade-down" className="  lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                </div>

            </div>


        </>
    )
}
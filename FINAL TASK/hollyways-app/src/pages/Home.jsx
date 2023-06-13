import Navbar from '../components/Navbar'
import Bar from '../components/Bar'
import '../css/Home.css'

import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import Aos from 'aos';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { useQuery, useMutation } from 'react-query';
import { API } from '../config/api';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../css/ProgresBar.css'
import ProgressBar from 'react-bootstrap/ProgressBar';
import Swal from 'sweetalert2';



export default function Home() {
    const [attache, setAttache] = useState([])

    useQuery('attacheCache', async () => {
        const response = await API.get('/attache');
        setAttache(response.data.data)
    });



    useEffect(() => {
        Aos.init({
            // once: true,
            duration: 900,
            delay: 300,
        }, [])
    })
    
    
    
        useEffect(() => {
        setTimeout(() => {
            Swal.fire(`I'm sorry because the backend hasn't been deployed because the railways are in trouble and the web isn't responsive, only for desktop viewing`)
        }, 3000);
    },[])
    
    
    
//     useEffect(() => {
//   setTimeout(() => {
//     alert(`I'm sorry because the backend hasn't been deployed and the web isn't responsive, only for desktop viewing`)
// }, 3000);
// })






    return (

        <div>
            < Navbar />
            <div data-aos="fade-down" className='container1' >
                <div className='d-flex mainContent1'>

                    <div data-aos="fade-right" className='mainContent1Left'>
                        <div className='innerMainContent1Left'>
                            <h1>While you are still standing, try to reach out to the people who are falling.</h1>
                        </div>
                        <div className='innerMainContent1Left'>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti quas ratione amet quasi
                                fugit quaerat ut praesentium, nam soluta impedit quia incidunt repellendus harum dignissimos natus neque ipsa necessitatibus?
                                Numquam sed dolore aliquam adipisci odio quaerat, nostrum, maxime perspiciatis, minima delectus sapiente iusto? Accusamus asperiores
                                possimus debitis at quas quasi laudantium, optio alias et modi animi eius obcaecati fugiat reprehenderit ullam ea. Modi consequuntur sed in
                                nobis molestiae incidunt cum molestias ad numquam ipsa aliquid eum, harum explicabo repellendus veritatis ut voluptatum impedit illo magni facere ducimus sunt,
                                dolorem eos voluptatibus. Dicta veritatis sunt fuga autem, assumenda nisi ex sapiente!</p>
                        </div>
                        <div className='innerMainContent1Left'>
                            <a rel="stylesheet" href="#container3" > <button className='downloadButton'>Donate now</button></a>

                        </div>

                    </div>


                    <div data-aos="fade-left" className='mainContent1Right d-flex flex-row-reverse'>
                        <img className='mainContent1RightImage' src="/images/mainImage2.png" alt="" />
                    </div>


                </div>
            </div>

            <div className='container2'>
                <div className='wave' data-aos="fade-down">
                    <img src="/images/waves.svg" alt="" />
                </div>
                <div className="d-flex secContent">
                    <div data-aos="fade-right" className='secContentLeft'>
                        <img className='secContentLeftImage' src="/images/mainImage3.png" alt="" />
                    </div>
                    <div className='secContentRight'>
                        <div data-aos="fade-left" className='innerSecContentRight'>
                            <h2>Your donation is very helpful for people affected by forest fires in kalimantan</h2>
                            <div className='d-flex deepInnerSecContentRight'>
                                <div className="leftDeepInnerSecContentRight m-5">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti
                                        tempora beatae illo iste. Delectus, neque accusamus! Voluptas possimus
                                        modi sit consectetur, voluptatem blanditiis adipisci animi aperiam odit numquam corrupti nobis.
                                        Tempore atque officia tenetur illo maxime eum commodi, maiores quisquam! Minus ipsedit.</p>
                                </div>
                                <div className='leftDeepInnerSecContentRight m-5'>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti
                                        tempora beatae illo iste. Delectus, neque accusamus! Voluptas possimus
                                        modi sit consectetur, voluptatem blanditiis adipisci animi aperiam odit numquam corrupti nobis.
                                        Tempore atque officia tenetur illo maxime eum commodi, maiores quihic minima exercitationem! Minus ipsum molestiae impedit.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <div id='container3' className='container3'>
                <div className='thrdContent'>
                    <h1 data-aos="fade-down">Donate Now</h1>

                    <div className="d-flex justify-content-center innerThrdContent">
                        {attache.map((item, index) => (

                            <Card data-aos="zoom-in-down" className='m-3' style={{ width: '18rem' }}>
                                <img width={'100%'} height={'200px'} src={item.image} alt="" />
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>
                                        {item.desc}
                                    </Card.Text>

                                    {/* <h1>{item.donated.reduce((total, nilai) => total + nilai, 0)}</h1> */}
                                    <div>
                                        <ProgressBar variant="danger" className='progresBar' now={
                                            Math.floor((item.donated
                                                .filter(donated => donated.status === 'success')
                                                .reduce((total, nilai) => total + nilai.donated, 0) / item.donation) * 100)
                                        } />
                                    </div>
                                    <div>

                                    </div>
                                    <div className="d-flex footerCard">
                                        <div className='value'>
                                            <p>Rp.{item.donation}</p>
                                        </div>

                                        <div className='value'>
                                            <a href={`/detaildonation/${item.id}`}>
                                                <button className='buttonCard'>Donate</button>
                                            </a>
                                        </div>
                                    </div>

                                </Card.Body>
                            </Card>

                        ))}

                    </div>
                </div>

            </div>
        </div >

    )
}

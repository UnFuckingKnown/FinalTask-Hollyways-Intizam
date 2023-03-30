import Navbar from '../components/Navbar'
import '../css/ListFundraising.css'
import { Link } from 'react-router-dom';
import Bar from '../components/Bar'
import Card from 'react-bootstrap/Card';
import { useQuery } from 'react-query';
import { API } from '../config/api';
import { useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Aos from 'aos';

export default function ListFundraising() {



    const [attache, setAttache] = useState([])



    useQuery('attacheCache', async () => {
        const response = await API.get('/attache');
        setAttache(response.data.data)
    });


    useEffect(() => {
        Aos.init({
            once: true,
            duration: 900,
            delay: 300,
        }, [])
    })


    return (
        <>
            <Navbar />
            <div data-aos="zoom-out" className='containerListFundraising'>


                <div className='mainContentListFundraising'>
                    <div className='d-flex topContentListFundraising'>
                        <div className='topLeftContentListFundraising'>
                            <h1>My Raise Fund</h1>
                        </div>

                        <Link to="/makefundraising">
                            <div className='topRightContentListFundraising'>
                                <button className='buttonTopRightContentListFundraising'>make raise found</button>
                            </div>
                        </Link>




                    </div>

                    <div className='bottomContentListFundraising'>

                        {/* <div data-aos="zoom-out-up" className="cardBottom">
                            <img src="/images/cardBottom1.png" alt="" />
                            <div className='cardTitle'>
                                <h5>The strengh of people power of community</h5>
                            </div>
                            <div>
                                <Bar />
                            </div>
                            <div className='cardContent'>
                                <p>Lorem ipsum dolor sit amet consectetur.</p>
                            </div>

                            <div className="d-flex footerCard">

                                <div className='value'>
                                    <p>Rp.120.000</p>
                                </div>

                                <div className='value'>
                                    <a href="/detaildonation">
                                        <button className='buttonCard'>View Fund</button>
                                    </a>

                                </div>
                            </div>

                        </div> */}

                        <div className="d-flex justify-content-center innerThrdContent">
                            {attache.map((item) => (
                                <Card data-aos="zoom-in-down" className='m-3' style={{ width: '18rem' }}>
                                    <img width={'100%'} height={'200px'} src={item.image} alt="" />
                                    <Card.Body>
                                        <Card.Title>  {item.title}</Card.Title>
                                        <Card.Text>
                                           {item.desc}
                                        </Card.Text>
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



            </div>
        </>
    )
}
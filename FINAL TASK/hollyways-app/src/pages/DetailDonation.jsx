import Navbar from '../components/Navbar'
// import Bar from '../components/Bar'
import '../css/DetailDonation.css'
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Aos from 'aos';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API, setAuthToken } from '../config/api';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
// import { useNavigate } from 'react-router-dom';
import moment from 'moment'
// import Moment from 'react-moment';
import ProgressBar from 'react-bootstrap/ProgressBar';
import '../css/ProgresBar.css'

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';






export default function DetailDOnation() {

    const [payment, setPayment] = useState(false);

    const [attache, setAttache] = useState([])
    const [currentDonate, setCurrentDonate] = useState([])
    console.log(currentDonate);

    const params = useParams();
    let attacheId = parseInt(params.id)



    useQuery('attacheCache', async () => {
        const response = await API.get('/attache/' + attacheId);
        setAttache(response.data.data)
    });


    const { refetch } = useQuery('attacheCacheAll', async () => {
        const response = await API.get('/attache');
        let news = response.data.data
        let hasilPencarian = news.find(objek => objek.id === attacheId);
        setCurrentDonate([hasilPencarian])
    });


    let semuaDonasi = currentDonate
        .map(objek => objek.donated)
        .flat()
        .filter(donated => donated.status === 'success')
        .map(donated => donated.donated);

    // console.log(semuaDonasi);



    // approved section
    const approvedDonation = semuaDonasi.length

    let listApprovedDonation = currentDonate
        .map(objek => objek.donated)
        .flat()
        .filter(donated => donated.status === 'success')
    // approved section


    // didnt approved
    let listDidntApprovedDonation = currentDonate
        .map(objek => objek.donated)
        .flat()
        .filter(donated => donated.status != 'success')

    const didntApprovedDonation = listDidntApprovedDonation.length

    // console.log(listApprovedDonation);
    // didnt approved


    let totalDonasi = semuaDonasi.reduce((total, nilai) => total + nilai, 0);

    let donatedrp = totalDonasi.toLocaleString()

    // item.donated.reduce((total, nilai) => total + nilai, 0)



    function diffDays(end) {
        const today = new Date().toISOString().split("T")[0]
        const endDate = new Date(end.split("T")[0])
        const diff = moment(endDate).diff(moment(today), "days")
        return diff
    }


    const persentage = Math.floor((totalDonasi / attache.donation) * 100)





    useEffect(() => {
        Aos.init({
            once: true,
            duration: 900,
            delay: 300,
        }, [])
    })



    setInterval(() => {
        refetch()
    }, 3500);


    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);





    return (
        <>
            <Navbar />
            <Payment show={payment} onHide={() => setPayment(false)} />
            <div data-aos="zoom-out" className="d-flex container1DetailDonation">
                <div className="container1DetailDonationLeft">
                    <img src={attache.image} alt="" />
                </div>
                <div className="container1DetailDonationRight">

                    <div className="container1DetailDonationRightTop">
                        <h1>{attache.name}</h1>
                        <div className='progresDonation'>
                            <h4> <span className='progresBarDonated'>Rp.{donatedrp}</span>  <span className='innerProgresDonation'>gethered from</span> <span className='progresBarTotalDonation'>Rp.{attache.donation}</span> </h4>
                        </div>
                        <div className='d-flex progresBar '>
                            <ProgressBar variant="danger" className='progresBar' now={persentage} label={`${persentage}%`} />
                        </div>
                        <div className='d-flex daysDonation justify-content-between m-3'>
                            <h6>{semuaDonasi.length}<span className='days'>Donation</span></h6>

                            {



                                attache.endDate && <h6>{diffDays(attache.endDate)}<span className='days'>More Day</span></h6>
                            }
                        </div>
                        <p>
                            {attache.desc}
                        </p>
                    </div>

                    <div className='d-flex buttonDetailDonate'>
                        <button onClick={() => setPayment(true)}>Donate</button>
                    </div>





                </div>
            </div>

            <div data-aos="fade-up" className="containerDetailDonation2">
                <div className="containerDetailDonation2Title">
                    <h1>List Donation Approved ( {approvedDonation} )</h1>
                </div>
                {listApprovedDonation.map((item) => (
                    <div>

                        <div className="containerDetailDonation2Content">
                            <div className="containerDetailDonation2Card">
                                <h4>{item.user.name}</h4>
                                <p>{moment(item.donatedTime).format('DD-MM-YYYY')}</p>
                                <p>total : Rp.{item.donated.toLocaleString()}</p>

                            </div>
                        </div>

                    </div>

                ))}


            </div>

            <div data-aos="fade-up" className="containerDetailDonation2">
                <div className="containerDetailDonation2Title">
                    <h1>Donation has not been aproved ({didntApprovedDonation})</h1>
                </div>
                {listDidntApprovedDonation.map((item) => (
                    <div>
                        <div className="containerDetailDonation2Content">
                            <div className="containerDetailDonation2Card">
                                <h4>{item.user.name}</h4>
                                <p>{moment(item.donatedTime).format('DD-MM-YYYY')}</p>
                                <p>total : Rp.{item.donated.toLocaleString()}</p>

                            </div>
                        </div>

                    </div>

                ))}


            </div>
        </>
    )
}


function Payment(props) {

    let navigate = useNavigate();

    const params = useParams();



    let attacheID = parseInt(params.id)
    const [attache, setAttache] = useState([])

    // 25 mar
    useQuery('attachePayment', async () => {
        const response = await API.get('/attache/' + attacheID);
        setAttache(response.data.data)
    });
    // 25 mar

    const [form, setForm] = useState("")

    function onChangeHandler(e) {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value
            }
        )
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();
            const currentTime = new Date().toISOString();
            const formData = new FormData()
            formData.set("titleAttache", attache.name)
            formData.set("donated", form.donated)
            formData.set("donatedTime", currentTime.split("T")[0])
            formData.set("attacheid", attacheID)

            const response = await API.post('/donated', formData)

            const token = response.data.data.token;
            window.snap.pay(token, {
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    // const response = API.post('/donated', formData)

                    console.log(result);
                    navigate("/profile");
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses!',
                        text: 'Donated sukses.',
                        timer: 2000, // waktu tampilan SweetAlert dalam milidetik
                        timerProgressBar: true,
                        showConfirmButton: false
                    });

                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    Swal.fire({
                        icon: 'error',
                        title: `Did'nt Approved!`,
                        text: `Yours Donation Did'nt Approved`,
                        timer: 2000, // waktu tampilan SweetAlert dalam milidetik
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                },
            });

        } catch (error) {
            alert("failed donate")
            console.log("donate failed : ", error);
        }
    })



    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <div className="form-group">
                        <input onChange={onChangeHandler} name='donated' type="text" className="form-control mt-3" placeholder="Nominal Donation" />
                    </div>
                    <button type="submit" className="btn btn-danger     mt-3 w-100 button">Donate</button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-danger' onClick={props.onHide} >Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
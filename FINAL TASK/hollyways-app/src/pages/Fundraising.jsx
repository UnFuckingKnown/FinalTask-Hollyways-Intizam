import Navbar from '../components/Navbar'
import '../css/Fundraising.css'

import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Aos from 'aos';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { API, setAuthToken } from '../config/api';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';



export default function Fundraising() {
    useEffect(() => {
        Aos.init({
            once: true,
            duration: 900,
            delay: 300,
        }, [])
    })





    const [form, setForm] = useState("")
    let navigate = useNavigate();
    // const [preview, setPrivew] = useState(null)

    const onChangeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        });

        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0]);
            // setPrivew(url)
        }

    };



    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            };

            const formData = new FormData();

            formData.set('title', form.title);
            formData.set('image', form.image[0]);
            formData.set('endDate', form.endDate);
            formData.set('donation', form.donation);
            formData.set('desc', form.desc);

            console.log(form);

            const response = await API.post('/attache', formData, config);
            console.log("add attache succes : ", response);

            Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Data Has Inputed',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            navigate('/listfundraising')

        } catch (error) {
            console.log("add attache failed : ", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Add Attache Failed`,
            })
        }
    });





    return (
        <>
            <Navbar />
            <div data-aos="zoom-in"
                data-aos-easing="linear"
                data-aos-duration="900" className='mainContainerFundraising'>
                <div className='ContainerFundraising'>
                    <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <div className="mb-3">
                            <input onChange={onChangeHandler} name="title" type="text" className="form-control inputFundraising" placeholder='Title' />
                        </div>
                        <div className="mb-3">
                            <label for="formFile" className="form-label attacheFundraising">Attache Thumbnail</label>
                            <input onChange={onChangeHandler} name="image" className="form-control inputFundraising" type="file" id="formFile" />
                        </div>
                        <div className="mb-3">
                            <label for="endDate" className="form-label attacheFundraising">End Date</label>
                            <input onChange={onChangeHandler} name='endDate' type="date" className="form-control inputFundraising" id="endDate" />
                        </div>
                        <div className="mb-3">
                            <input onChange={onChangeHandler} name="donation" type="number" className="form-control inputFundraising" placeholder='Goals Donation' />
                        </div>
                        <div >
                            <textarea onChange={onChangeHandler} name="desc" className='fundraisingTextarea inputFundraising' id="" cols="30" rows="10" placeholder='Description'></textarea>
                        </div>
                        <div className='d-flex  justify-content-end m-4'>
                            <button type="submit" class="btn btn-primary attacheFundraising">Public Fundraising</button>
                        </div>

                    </form>
                </div>
            </div>

        </>

    )
}
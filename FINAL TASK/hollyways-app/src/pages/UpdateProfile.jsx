import Navbar from '../components/Navbar'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../css/UpdateProfile.css'
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { API } from '../config/api';
import { useEffect } from 'react';
import Aos from 'aos';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

export default function UpdateProfile() {



    useEffect(() => {
        Aos.init({
            once: true,
            duration: 900,
            delay: 300,
        }, [])
    })



    let navigate = useNavigate();
    const [form, setForm] = useState({})
    const onChangeHandler = (e) => {
        console.log("tes");
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        });
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0]);
        }
    };


    const handleSubmit = useMutation(async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            };
            const formData = new FormData();
            formData.set('image', form.image[0]);
            formData.set('phone', form.phone)


            const response = await API.post('/profile', formData, config);
            console.log("add profile success : ", response);
            Swal.fire({
                icon: 'success',
                title: 'Sukses!',
                text: 'Add sukses.',
                timer: 2000, // waktu tampilan SweetAlert dalam milidetik
                timerProgressBar: true,
                showConfirmButton: false
            });
        } catch (error) {
            console.log("add profile failed : ", error);
        }
    });


    return (
        <>
            <Navbar />
            <div data-aos="fade-up" className="mainContainerUpdateProfile">
                <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Please Select Photo</Form.Label>
                        <Form.Control name='image' onChange={onChangeHandler} type="file" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control name='phone' onChange={onChangeHandler} type="text" placeholder="Phone Number" />
                    </Form.Group>

                    {/* <input onChange={onChangeHandler} name='phone' type="text" className="form-control mt-3" placeholder="Nominal Donation" /> */}

                    <Button variant="danger" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>

        </>
    )
}
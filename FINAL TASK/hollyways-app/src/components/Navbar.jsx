import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../css/Navbar.css'
import Modal from 'react-bootstrap/Modal';
import { useContext, useState } from 'react';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Aos from 'aos';
import { Offcanvas } from 'react-bootstrap';
// backend package
import { useNavigate } from 'react-router-dom';
import { API, setAuthToken } from '../config/api';
import { useMutation } from 'react-query';
import { UserContext } from '../context/userContext';



import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';




function RegisterModal(props) {

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
            const response = await API.post('/register', form);
            console.log("register success : ", response)

            Swal.fire({
                title: 'Registrasi Berhasil!',
                text: 'Anda telah berhasil melakukan registrasi',
                icon: 'success',
                confirmButtonText: 'OK'
            })
            // .then((result) => {
            //     if (result.isConfirmed) {
            //         window.location.href = '/';
            //     }
            // })


            setForm({
                email: '',
                password: '',
                name: '',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Register Failed`,
            })
            console.log("register failed : ", error);
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
                <form onSubmit={(e) => handleSubmit.mutate(e)} >
                    <div className="form-group">
                        <h1 className='font-weight-bold title'>Register</h1>
                        <input onChange={onChangeHandler} name="email" type="email" className="form-control mt-4" id="email" aria-describedby="emailHelp" placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <input onChange={onChangeHandler} name="password" type="password" className="form-control mt-3" id="password" placeholder="Password" />
                    </div>
                    <div className="form-group">
                        <input onChange={onChangeHandler} name="name" type="text" className="form-control mt-3" id="fullname" placeholder="Fullname" />
                    </div>
                    <button type="submit" className="btn btn-danger mt-3 w-100">Register</button>
                    <div className='text-center mt-3 botText'>
                        <p> Already have an account ? click  <a onClick={props.changerRegister}> Here</a></p>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-danger' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    );
}



function LoginModal(props) {

    const navigate = useNavigate()
    const [_, dispatch] = useContext(UserContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const { email, password } = form;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();
            const response = await API.post('/login', form);

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: response.data.data,
            });

            setAuthToken(localStorage.token);
            if (response.data.data.role === 'admin') {
                window.location.reload();
            }
            window.location.reload();

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `you didn't have account yet`,
            })


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
                        <h1 className='font-weight-bold title'>LOGIN</h1>
                        <input onChange={handleChange} name="email" type="email" className="form-control mt-4 input" id="email" aria-describedby="emailHelp" placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <input onChange={handleChange} type="password" name="password" className="form-control mt-3 input" id="password" placeholder="Password" />
                    </div>

                    <button type="submit" className="btn btn-danger mt-3 w-100 button">Submit</button>
                    <div className='text-center mt-3 botText'>
                        <p> Don't have an account yet?<a onClick={props.changerLogin}> Here</a></p>
                    </div>
                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-danger' onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}


function OffcanvasMenu({ show, handleClose }) {
    const navigate = useNavigate()

    const [state, dispatch] = useContext(UserContext)

    let removeToken = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("cart")
        window.location.reload();
        navigate("/")



    }


    return (
        <Offcanvas className='bg-light' show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className='text-dark'>
                    <h1 data-aos="fade-down">Menu</h1>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {state.user.role === "admin" &&
                    <Nav className="justify-content-end flex-grow-1 pe-3 ">
                        <Nav.Link href="/profile" >

                            <div data-aos="fade-right" className='d-flex'>
                                <img className='me-3' width={'25px'} height={'20px'} src="/images/user.png" alt="" />
                                <h6 className='text-dark '>PROFILE</h6>
                            </div>

                        </Nav.Link>

                        <Nav.Link href="/listfundraising" >

                            <div data-aos="fade-right" className='d-flex'>
                                <img className='me-3' width={'25px'} height={'20px'} src="/images/raise.png" alt="" />
                                <h6 className='text-dark'>RAISE FUND</h6>
                            </div>

                        </Nav.Link>

                        <Nav.Link href="/updateProfile">

                            <div data-aos="fade-right" className='d-flex'>
                                <img className='me-3' width={'25px'} height={'20px'} src="/images/pencil.png" alt="" />
                                <h6 className='text-dark'>Edit Profile</h6>
                            </div>

                        </Nav.Link>

                        <Nav.Link href="/" >

                            <div onClick={removeToken} data-aos="fade-right" className='d-flex'>
                                <img className='me-3' width={'25px'} height={'20px'} src="/images/logout1.png" alt="" />
                                <h6 className='text-dark'>LOGOUT</h6>
                            </div>

                        </Nav.Link>

                    </Nav>
                }


                {state.user.role === "user" &&
                    <Nav className="justify-content-end flex-grow-1 pe-3 ">
                        <Nav.Link href="/profile" >

                            <div data-aos="fade-right" className='d-flex'>
                                <img className='me-3' width={'25px'} height={'20px'} src="/images/user.png" alt="" />
                                <h6 className='text-dark '>PROFILE</h6>
                            </div>

                        </Nav.Link>

                        {/* <Nav.Link href="/listfundraising" >

                            <div data-aos="fade-right" className='d-flex'>
                                <img className='me-3' width={'25px'} height={'20px'} src="/images/raise.png" alt="" />
                                <h6 className='text-dark'>RAISE FUND</h6>
                            </div>

                        </Nav.Link> */}

                        <Nav.Link href="/updateProfile">

                            <div data-aos="fade-right" className='d-flex'>
                                <img className='me-3' width={'25px'} height={'20px'} src="/images/pencil.png" alt="" />
                                <h6 className='text-dark'>Edit Profile</h6>
                            </div>

                        </Nav.Link>

                        <Nav.Link href="/" >

                            <div onClick={removeToken} data-aos="fade-right" className='d-flex'>
                                <img className='me-3' width={'25px'} height={'20px'} src="/images/logout1.png" alt="" />
                                <h6 className='text-dark'>LOGOUT</h6>
                            </div>

                        </Nav.Link>

                    </Nav>
                }





            </Offcanvas.Body>
        </Offcanvas>
    );
}




function NavScrollExample() {
    const [registerModal, setRegisterModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [show, setShow] = useState(false);
    const [state, dispatch] = useContext(UserContext)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const changerRegister = () => {
        setRegisterModal(false)
        setLoginModal(true)
    }

    const changerLogin = () => {
        setRegisterModal(true)
        setLoginModal(false)
    }








    useEffect(() => {
        Aos.init({
            once: true,
            duration: 900,
            delay: 300,
        }, [])
    })

    return (

        <Navbar data-aos="fade-down" className='mainColor' expand="lg">

            <LoginModal show={loginModal} onHide={() => setLoginModal(false)} changerLogin={changerLogin} />
            <RegisterModal show={registerModal} onHide={() => setRegisterModal(false)} changerRegister={changerRegister} />
            <OffcanvasMenu show={show} handleClose={handleClose} />

            <Container fluid>
                <Navbar.Brand href="/">
                    <img className='imageNavbar' src="/images/Icon.png" alt="" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >

                    </Nav>

                    {!state.isLogin &&
                        <div className="d-flex">
                            <Button className='buttonNavbar1 me-3' onClick={() => setLoginModal(true)}>Login</Button>
                            <Button className='buttonNavbar2' onClick={() => setRegisterModal(true)} >Register</Button>
                        </div>
                    }


                    {state.isLogin &&


                        <>

                            {
                                state.user.profile.image === undefined || state.user.profile.image === null || state.user.profile.image === "" ? (
                                    <img onClick={handleShow} className="profileImage" src="https://res.cloudinary.com/dfdoyoati/image/upload/v1679816463/database/undefined_b9d8tr.png" alt='none' />
                                ) : (
                                    <img onClick={handleShow} className='profileImage' src={state.user.profile.image} alt="" />
                                )
                            }




                        </>


                    }










                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default NavScrollExample;
















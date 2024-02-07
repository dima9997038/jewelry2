import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import data from "bootstrap/js/src/dom/data";

function NavBar(props) {
    const [show, setShow] = useState(false);
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(localStorage.getItem("name"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [auth, setAuth] = useState(localStorage.getItem("auth"));

    function handleShow() {
        setShow(true)
    }

    function handleClose() {
        setShow(false)
    }

    function handleLogin(e) {
        e.preventDefault();
        axios.post(
            "http://localhost:8080/auth", {username: login, password: password}
        )
            .then(function (data) {
                console.log(data.data.token)
                localStorage.setItem("token", data.data.token)
                localStorage.setItem("auth", "true")
                const decode = jwtDecode(data.data.token)
                console.log (decode)
                localStorage.setItem("name", decode.sub)
                localStorage.setItem("role", decode.roles[0])
                setAuth("true")
                setRole(decode.roles[0])
                handleClose()
            })
            .catch(function (text) {
                alert("Wrong password")
            })
    }

    function handleControlLogin(e) {
        setLogin(e.target.value);
    }

    function handleControlPassword(e) {
        setPassword(e.target.value);
    }

    function handleLogout() {
       setAuth("false")
        localStorage.setItem("auth", "false")
        localStorage.setItem("token", "")
        localStorage.setItem("role", "")
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Link</Nav.Link>
                            {
                                auth==="false"
                                ?<>
                                        <Button variant="primary" className='me-2' onClick={handleShow}>Login</Button>
                                        <Button variant="primary" className='me-2'>Registration</Button>
                                        </>
                                    :<>
                                    {
                                        role==="ROLE_ADMIN"
                                        ?<Button variant="success" className='me-2'>AdminPanel</Button>
                                            :<>
                                            </>
                                    }
                                        <Button variant="outline-primary" className='me-2' >{name}</Button>
                                        <Button variant="primary" className='me-2' onClick={handleLogout}>Logout</Button>
                                    </>
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>Login</Form.Label>
                    <Form.Control type='text' onChange={handleControlLogin}>

                    </Form.Control>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' onChange={handleControlPassword}>

                    </Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleLogin}>
                        Login
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Exit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NavBar;
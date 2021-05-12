import {React,useState} from "react"

import { Link } from 'react-router-dom'
//import { v4 as uuidV4 } from "uuid"

export default function Login() {

    const mystyle = {
        height: '100vh',
        width: '100%'
    }
    const [id, setId] = useState('')
    const [name, setName] = useState('')

    return (
        <div style={mystyle} className='d-flex align-items-center justify-content-center flex-column ' >
            <div className="d-flex align-items-center mb-3 " >
                <form className="color-container p-5 text-white" >
                    <h3> Gúgol Docs </h3>
                    <br />
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input type="text" className="form-control" placeholder="Ingresa un nombre" onChange={event => setName(event.target.value)}/>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Ingresar codigo de documento:</label>
                        <input type="text" className="form-control" placeholder="Codigo de documento" onChange={event => setId(event.target.value)}/>
                    </div>
                    <br />
                    

                    <div className="d-flex align-items-center justify-content-center">
                    <Link to={id && name ? `/documents/${id}/${name}` : '#'} >
                        <button className="btn btn-light" disabled={id && name ? false : true}>
                            Conectarse
                        </button>

                        
                    </Link>
                    </div>

                </form>
            </div>
        </div>
    );

}


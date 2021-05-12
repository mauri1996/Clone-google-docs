import { Fragment, useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom'

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() {
  const { id: documentId } = useParams()
  const { name: nameuser } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const [mensaje, setMensaje] = useState()

  useEffect(() => {
    const s = io("http://localhost:3001")
    setSocket(s)

    return () => {
      s.disconnect()
    }


  }, [])


  useEffect(() => {

    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })
    socket.emit("get-document", documentId, nameuser)

  }, [socket, quill, documentId, nameuser])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    socket.on("clients-connect", (users)=>{
      console.log(socket.id)
      console.log("Clientes activos", users)
      setMensaje("Tenemos un nuevo invitado, espero que traiga pizza!! 🍕🍕")
      setTimeout (()=>{
        
        setMensaje("")
      }, 5000)
    })

    socket.on("clients-disconnect", (users)=>{
      console.log(socket.id)
      console.log("Clientes activos", users)
      setMensaje("Se fue, revisen si ha avanzado algo!! 🙊🙊")
      setTimeout (()=>{
        
        setMensaje("")
      }, 5000)
    })

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, [])
  return (
  <Fragment >
    
    <nav className="navbar navbar-expand-lg color-container mb-3 mt-3 container text-white rounded">
      <div class="container-fluid">
        <h3 > < strong > Yo soy: </strong> {nameuser}</h3 >
 
        <div className="d-flex" id="mensaje" >
          <small> {mensaje} </small>
        </div>
        <Link to="/" >
          <button className="btn btn-light" >
           Regresar 
          </button>
         </Link>
        </div>
    </nav>
    <div className="container" ref={wrapperRef} ></div>
    
  </Fragment> );
}


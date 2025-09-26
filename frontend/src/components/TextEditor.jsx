import "highlight.js/styles/monokai-sublime.css" // dark code style
import hljs from "highlight.js"
import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"

import { io } from "socket.io-client"
import { useParams } from "react-router-dom"

// Toolbar just for code
const TOOLBAR_OPTIONS = [

  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
]

const SAVE_INTERVAL_MS = 5000

export default function TextEditor() {
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()
  const { id: documentId } = useParams()

  //set up socket on mount
  useEffect(() => {
    const s = io("http://localhost:5001")
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  //create custom rooms
  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable()
    })

    socket.emit("get-document", documentId)
  }, [socket, quill, documentId])

  //save the document
  useEffect(() => {
    if (socket == null || quill == null) return
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  //send a delta
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

  //receive a delta
  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }

    socket.on("recive-changes", handler)

    return () => {
      socket.off("recive-changes", handler)
    }
  }, [socket, quill])

  //set up quill on mount
  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        // syntax: {
        //   highlight: text => hljs.highlightAuto(text).value,
        // },
      },
    })

    // Code-like look
    q.root.style.fontFamily = `"Fira Code", monospace`
    q.root.style.fontSize = "14px"
    q.root.style.backgroundColor = "#1e1e1e"
    q.root.style.color = "#dcdcdc"

    q.enable(false)
    q.setText("Loading...")
    setQuill(q)
  }, [])

  return <div className="container" ref={wrapperRef}></div>
}

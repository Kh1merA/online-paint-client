import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import { observer } from "mobx-react-lite"
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/canvas.scss";
import Brush from "../tools/Brush";
import {Button, Modal} from "react-bootstrap";
import Rect from "../tools/Rect";

const Canvas = observer(() => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true);
    const params = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
    }, []);

    useEffect(() => {
        if(canvasState.username){
            const socket = new WebSocket("ws://localhost:5000/");
            canvasState.setSocket(socket);
            canvasState.setSessionId(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id));
            console.log(canvasRef.current, socket, params.id);
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }));
            }
            socket.onmessage = (e) => {
                let msg = JSON.parse(e.data);
                switch(msg.method){
                    case "connection":
                        console.log(`User ${msg.username} connected!`);
                        break
                    case "draw":
                        drawHandler(msg);
                        break
                }
            }
        }
    }, [canvasState.username]);

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext("2d");
        switch (figure.type) {
            case 'brush':
                Brush.draw(ctx, figure.x, figure.y, figure.color);
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
                break
            case 'finish':
                ctx.beginPath();
                break
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
    }

    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModal(false);
    }

    return (
        <div className="canvas">
            <Modal
                show={modal}
                onHide={() => {}}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Enter your name
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef} className='modal-input'/>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => connectionHandler()} style={{backgroundColor: "grey", border: "grey"}}>Enter</Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={1000} height={500}/>
        </div>
    );
});

export default Canvas;
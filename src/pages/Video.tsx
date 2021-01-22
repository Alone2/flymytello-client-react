import React from "react";
import styles from "./Video.module.css";
import DroneWebRTCConnection from "../internal/DroneConnection";
import Control from "../internal/Gamepad";
import { CircularProgress, Button } from "@material-ui/core";

interface videoProps {
    ipAddress: string;
    password: string;
    onWantToReturnToSelect: () => void;
}

interface videoState {
    connectionFailed: boolean;
    autoPlay: boolean;
    controls: boolean;
    muted: boolean;
    loop: boolean;
    connectionOpen: boolean;
}

// Shows video of server
class Video extends React.Component<videoProps, videoState> {
    private srcRef = React.createRef<HTMLVideoElement>();

    constructor(props : videoProps) {
        super(props);
        this.state = {
            connectionOpen: false,
            autoPlay: true,
            controls: true,
            muted: true,
            loop: false,
            connectionFailed: false,
        };
    }

    // Verbindung mit Server, WebRTC wird initialisiert
    // sobald Initialisierung geschehen ist
    componentDidMount() {
        const drone = new DroneWebRTCConnection(this.props.ipAddress, this.props.password);

        drone.onConnectionEstablished = event => {
            if (!event.successful) {
                this.setState({
                    connectionFailed: true,
                });
                return;
            }
            if (event.media != undefined) {
                // listen to keyboard and Gamepad
                this.srcRef.current!.srcObject = event.media;
                Control.onControlInput = drone.sendInstructions;
                const control = new Control();
                control.start();

                this.setState({
                    connectionOpen: true,
                    autoPlay: true,
                    controls: false,
                    muted: true,
                    loop: false,
                });
            } else {
                this.setState({
                    connectionFailed: true,
                });
            }
        };

        setTimeout(() => {
            if (!this.state.connectionOpen) {
                this.setState({
                    connectionFailed: true,
                });
            }
        }, 10000);

    }
    render() {
        const retry = <div>
            <b>Connection Failed</b>
            <br/>
            <br/>
            <Button onClick={this.props.onWantToReturnToSelect} variant="contained" type="submit" color="primary" >Go back</Button>
        </div>;
        return <div className={styles.videoHolder}> 
            <div className={styles.wait + " " + (this.state.connectionOpen ? "": styles.foreground)}>
                { this.state.connectionFailed ? retry : <CircularProgress/> }
            </div>
            <video className={styles.video}
                autoPlay={this.state.autoPlay} 
                controls={this.state.controls} 
                muted={this.state.muted} 
                loop={this.state.muted}
                ref={this.srcRef}> 
            </video>
        </div>;
    }
}


export default Video;

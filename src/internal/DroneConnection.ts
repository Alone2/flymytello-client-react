interface DroneConnectionEvent {
    successful: boolean;
}

interface DroneWebRTCConnectionEvent extends DroneConnectionEvent {
    media?: MediaStream;
}

interface DroneConnection {
    onConnectionEstablished : ( event : DroneConnectionEvent ) => void;
    sendInstructions : ( msg : string ) => void;
}

interface signalingInit extends RTCSessionDescriptionInit {
    Token: string;
}

// Establishes a connection to the server
class DroneWebRTCConnection implements DroneConnection {
    private socket : WebSocket;
    private password : string;
    private rtcConnection : RTCPeerConnection;
    private rtcDataChannel : RTCDataChannel;
    // Runs when Connection is established or unsuccessful
    public onConnectionEstablished: (event : DroneWebRTCConnectionEvent) => void;

    constructor(ip : string, password : string) {
        this.socket = new WebSocket("wss://" + ip + ":5001/signal");
        this.password = password;
        this.onConnectionEstablished = () => {};

        // bind methods
        this.onIceCandidateHandler = this.onIceCandidateHandler.bind(this);
        this.onMessageSocketHandler = this.onMessageSocketHandler.bind(this);
        this.sendInstructions = this.sendInstructions.bind(this);

        // new RTCPeerConnection
        const conf = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};
        this.rtcConnection = new RTCPeerConnection(conf);

        // Media available
        this.rtcConnection.ontrack = event => {
            const media : MediaStream = event.streams[0];
            this.onConnectionEstablished({successful: true, media: media});
        };
        // set receive/send properties
        this.rtcConnection.addTransceiver("video", {"direction": "sendrecv"});

        // create Offer and then set it as LocalDescription
        this.rtcConnection.createOffer().then(sd => this.rtcConnection.setLocalDescription(sd));

        // new dataChannel
        this.rtcDataChannel = this.rtcConnection.createDataChannel("telloInstructions");
        
        // find all Candidates
        this.rtcConnection.onicecandidate = this.onIceCandidateHandler;
         
        // Socket Message
        this.socket.onmessage = this.onMessageSocketHandler;
    }
    
    // Found ICE candidate
    private onIceCandidateHandler(event : RTCPeerConnectionIceEvent) {
        // event.candidate == null if all candidates gathered
        if (event.candidate === null) {
            // wait for socket initialisation
            setTimeout(() => {
                // check if initialisation successful
                if (this.socket === undefined) {
                    this.onConnectionEstablished({successful: false, media: new MediaStream()});
                } else if (this.socket.readyState !== 1) {
                    this.onConnectionEstablished({successful: false, media: new MediaStream()});
                } else {
                    // Send SessionDescription offer with password
                    const authSessionDesc = {
                        sdp: this.rtcConnection.localDescription?.sdp,
                        type: this.rtcConnection.localDescription?.type,
                        password: this.password,
                    };
                    this.socket.send(JSON.stringify(authSessionDesc));
                }
            }, 4000);
        }
    }
    
    // Send string to server over secure and fast datachannel
    sendInstructions(msg : string) {
        try {
            this.rtcDataChannel.send(msg);
        } catch (e) {
            console.log(e);
        }
    }
    
    // Get incoming sessionDescription from signaling websocket
    private onMessageSocketHandler(event : MessageEvent) {
        const sd = event.data;
        console.log(event.data);
        const response : signalingInit = JSON.parse(sd);
        this.rtcConnection.setRemoteDescription(new RTCSessionDescription({
            sdp: response.sdp,
            type: response.type,
        }));
        this.socket.close();
    }
}

export default DroneWebRTCConnection;

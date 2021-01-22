interface DroneInstruction {
    command : string;
    forwardsbackwards : number;
    updown : number;
    leftright : number;
    yaw : number;
}

class Control {
    static onControlInput : (msg: string) => void = () => {};
    static buttonspressed = {
        j: false,
        k: false,
        w: false,
        a: false,
        s: false,
        d: false,
        h: false,
        l: false,
    };
    private loopInterval : NodeJS.Timeout | null = null;

    start() {
        this.loopInterval = setInterval(this.gamepadLoop.bind(this), 50);
        document.onkeydown = this.keyDownEvent.bind(this);
        document.onkeyup = this.keyUpEvent.bind(this);
    }

    stop() {
        if (this.loopInterval != null) {
            clearTimeout(this.loopInterval);
        }
        document.onkeyup = () => {};
        document.onkeydown = () => {};
    }
    // Checks whats pressed on the Gamepad
    private gamepadLoop() {
        const gamepads = navigator.getGamepads();

        for (let i = 0; i < gamepads.length; i++) {
            const gp = gamepads[i];
            if (gp) {
                // A
                if (gp.buttons[0].pressed) {
                    this.sendCommand("takeoff");
                    break;
                }
                // B
                if (gp.buttons[1].pressed) {
                    this.sendCommand("land");
                    break;
                }
              
                let updown = 0;
                if (gp.axes[2] > 0) {
                    updown = -gp.axes[2];
                }
                if (gp.axes[5] > 0) {
                    updown = gp.axes[5];
                }
                this.sendInstruction({
                    command: "fly",
                    forwardsbackwards: -gp.axes[1],
                    updown: updown,
                    leftright: gp.axes[0],
                    yaw: gp.axes[3],
                });
            }

        }
    }

    private keyUpEvent( event : KeyboardEvent ) {
        this.keyToBool(event, false);
    }

    private keyDownEvent( event : KeyboardEvent ) {
        this.keyToBool(event, true);
    }

    private keyToBool(event : KeyboardEvent, bool : boolean) {
        switch (event.keyCode) {
        //k
        case 75:
            Control.buttonspressed.k = bool;
            break;
        //w
        case 87:
            Control.buttonspressed.w = bool;
            break;
        //a
        case 65:
            Control.buttonspressed.a = bool;
            break;
        //s
        case 83:
            Control.buttonspressed.s = bool;
            break;
        //d
        case 68:
            Control.buttonspressed.d = bool;
            break;
        //j
        case 74:
            Control.buttonspressed.j = bool;
            break;
        //h
        case 72:
            Control.buttonspressed.h = bool;
            break;
        //l
        case 76:
            Control.buttonspressed.l = bool;
            break;
        //shift
        case 16:
            // this.sendCommand("land");
            this.sendCommand("streamon");
            return;
        //space
        case 32:
            // this.sendCommand("command");
            this.sendCommand("takeoff");
            return;
        } 
        const newDirection : DroneInstruction = {
            command: "fly",
            forwardsbackwards: 0,
            leftright: 0,
            yaw: 0,
            updown: 0,
        };
        if (Control.buttonspressed.w) newDirection.forwardsbackwards = 1;
        if (Control.buttonspressed.s) newDirection.forwardsbackwards = -1;
        if (Control.buttonspressed.a) newDirection.leftright = -1;
        if (Control.buttonspressed.d) newDirection.leftright = 1;
        if (Control.buttonspressed.j) newDirection.updown = -1;
        if (Control.buttonspressed.k) newDirection.updown = 1;
        if (Control.buttonspressed.h) newDirection.yaw = -1;
        if (Control.buttonspressed.l) newDirection.yaw = 1;
        this.sendInstruction(newDirection);
    }

    private sendInstruction(newInstruction : DroneInstruction) {
        Control.onControlInput(JSON.stringify(newInstruction));
    }

    private sendCommand(command : string) {
        this.sendInstruction({
            command: command,
            forwardsbackwards: 0,
            updown: 0,
            leftright: 0,
            yaw: 0,
        });
        // DEBUG
        console.log(command);
    }
}

export default Control;

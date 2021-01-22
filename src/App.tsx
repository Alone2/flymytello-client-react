import React from "react";
import Select from "./pages/Select";
import Video from "./pages/Video";

interface appProps {
}

interface appState {
    ipAddress: string,
    password: string,
}

class App extends React.Component<appProps, appState>{
    constructor(props : appProps) {
        super(props);
        this.state = {
            ipAddress: "",
            password: "",
        };
        this.ipSelected = this.ipSelected.bind(this);
        this.returnToSelect = this.returnToSelect.bind(this);
    }
    // User sent ip and password
    ipSelected(ip : string, password : string) {
        this.setState({
            ipAddress: ip,
            password: password,
        });
    }
    // Go back to start screen
    returnToSelect() {
        this.setState({
            ipAddress: "",
            password: "",
        });
    }
    render() {
        let out = <Select onSelected={this.ipSelected}/>;
        if (this.state.ipAddress !== "") 
            out = <Video onWantToReturnToSelect={this.returnToSelect} ipAddress={this.state.ipAddress} password={this.state.password} />;
        return (
            <div>
                { out }
            </div>
        );

    }
}

export default App;

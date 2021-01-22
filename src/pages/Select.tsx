import React from "react";
import { Button, TextField} from "@material-ui/core";
import styles from "./Select.module.css";
import Drone from "../components/Drone";

interface selectProps {
    // Runs when form submitted
    onSelected: (ip: string, password: string) => void
}

interface selectState {
    ip: string;
    passwd: string;
    isReady: boolean;
}

// Select Component. Shows form
class Select extends React.Component<selectProps, selectState> {
    constructor(props : selectProps) {
        super(props);
        
        this.state = {
            ip: "",
            passwd: "",
            isReady: false,
        };

        this.sendForm = this.sendForm.bind(this);
    }
    // Form submitted
    sendForm(event : React.FormEvent<HTMLFormElement>) {
        // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
        event.preventDefault();
        const target = event.target as typeof event.target & {
          ip: { value: string };
          passwd: { value: string };
        };
        const ip = target.ip.value; 
        const passwd = target.passwd.value; 
        this.setState({
            isReady: true,
        });
        setTimeout(() => {
            this.props.onSelected(ip, passwd);
        }, 1000);
    }
    render() { 
        return <div className={styles.father}>
            {this.state.isReady ? <div className={styles.overlay}/> : null}
            <div className={styles.logo}>
                <Drone goAway={this.state.isReady}/>
            </div>
            <div className={styles.center}>
                <div className={styles.selectHolder}>
                    <form onSubmit={this.sendForm}>
                        <TextField className={styles.txt} name="ip" 
                            id="standard-basic" label="Domain" /><br/>
                        <TextField className={styles.txt} name="passwd" 
                            id="standard-password-input" type="password" label="Passwort" /><br/>
                        <br/>
                        <Button variant="contained" type="submit" color="primary" >Verbinden</Button>
                    </form>
                </div>
            </div>
        </div>;
    }
}

export default Select;

import React from "react";
import styles from "./Drone.module.css";
import Anime from "react-anime";
import dronebody from "../assets/tutorial/dronenoprop.svg";
import iconback from "../assets/icons/icon_background.svg";
import dronepropellar1 from "../assets/tutorial/propellar.svg";
import dronepropellar2 from "../assets/tutorial/propellar2.svg";

interface droneProps {
    goAway: boolean
}

interface droneState {
    isFlying: boolean,
}

class Drone extends React.Component<droneProps, droneState> {
    constructor(props : droneProps) {
        super(props);

        this.state = {
            isFlying: false,
        };
    }
    render() {
        const translate = window.innerWidth/2 + 100;
        let translateY = 0;
        let easing : "easeInExpo" | "easeOutExpo" = "easeOutExpo";
        /* let rotate = 360 * 4; */
        let rotate = 360 * 4;
        let delay = 100;
        let duration = window.innerWidth/2 * 2;
        if (this.props.goAway) {
            translateY = -600;
            rotate = -1440;
            easing="easeInExpo";
            delay = 0;
            duration = duration / 2;
        } 

        return <div className={styles.droneHolder}>
            <img className={styles.droneBackground} src={iconback} alt=""/>
            <div className={styles.drone + " " + styles.dbody}>
                <Anime easing={easing} translateX={translate} translateY={translateY} delay={delay} duration={duration} complete={() => {this.setState({isFlying: false});}}>
                    <img src={dronebody} alt=""/>
                </Anime>
            </div>
            <div className={styles.drone + " " + styles.prop + " " + styles.pr4}>
                <Anime easing={easing} translateX={translate} translateY={translateY} rotate={rotate} delay={delay} duration={duration}>
                    <img src={dronepropellar1} alt="" />
                </Anime>
            </div>
            <div className={styles.drone + " " + styles.prop + " " + styles.pr3}>
                <Anime easing={easing} translateX={translate} translateY={translateY} rotate={rotate} delay={delay} duration={duration}>
                    <img src={dronepropellar2} alt="" />
                </Anime>
            </div>
            <div className={styles.drone + " " + styles.prop + " " + styles.pr2}>
                <Anime easing={easing} translateX={translate} translateY={translateY} rotate={rotate} delay={delay} duration={duration}>
                    <img src={dronepropellar2} alt="" />
                </Anime>
            </div>
            <div className={styles.drone + " " + styles.prop + " " + styles.pr1}>
                <Anime easing={easing} translateX={translate} translateY={translateY} rotate={rotate} delay={delay} duration={duration}>
                    <img src={dronepropellar1} alt="" />
                </Anime>
            </div>
            <div className={styles.appName}>
                <b>Flymytello</b>
            </div>
        </div>;
    }
}

export default Drone;

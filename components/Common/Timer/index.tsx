// Libs
import React, {ReactNode, useEffect, useState} from "react";
// Components
import Button from "@/components/Common/Button";

interface Props {
    counter?: number
    handleCallback: ()=>void
    start?: boolean
}

/**
 * Timer Component
 * @param props
 * @constructor
 */
const Timer = (props: Props) => {
    const [second, setSecond] = useState<string|number>('00');
    const [minute, setMinute] = useState<string|number>('00');
    const [counter, setCounter] = useState(props.counter || 60);
    const [startTimer, setStartTimer] = useState(props.start? true : false);

    useEffect(() => {
        let intervalId: any;

        if (startTimer) {
            intervalId = setInterval(() => {
                const secondCounter = counter % 60;
                const minuteCounter = Math.floor(counter / 60);

                const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}`: secondCounter;
                const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}`: minuteCounter;

                setSecond(computedSecond);
                setMinute(computedMinute);

                setCounter(counter => counter - 1);
                if(!counter) stopTimer();
            }, 1000)
        }

        return () => clearInterval(intervalId);
    }, [startTimer, counter]);

    const stopTimer = () => {
        setStartTimer(false);
        setCounter(props.counter || 60);
        setSecond('00');
        setMinute('00')
    };

    const handle = () => {
        props.handleCallback();
        setStartTimer(true);
    }

    return(
        <Button fullWidth={true}
                disabled={startTimer}
                variant={'outlined'}
                onClick={()=>handle()}>
            {startTimer && <>{minute}:{second}</>} Resend Email
        </Button>
    );
}

export default Timer;

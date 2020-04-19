import * as timers from 'timers';

export function wait(time: number) {
    return new Promise((resolve) => {
        timers.setTimeout(resolve, time);
    });
}
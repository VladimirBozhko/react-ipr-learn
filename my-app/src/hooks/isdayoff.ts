import {useEffect, useState} from "react";
import {stringifyDate} from "../utils"

export function useDayOff(date: Date | null): boolean | null {
    const [isDayOff, setIsDayOff] = useState<boolean | null>(null);
    const dateParam = date ? stringifyDate(date) : "today";

    useEffect(() => {
        fetch(`https://isdayoff.ru/${dateParam}`)
            .then((res) => res.json())
            .then((data) => {
                setIsDayOff(Boolean(data))
            });
    }, [dateParam]);

    return isDayOff;
}
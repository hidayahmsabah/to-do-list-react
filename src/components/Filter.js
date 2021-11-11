// import { useState } from "react"
// import { useEffect } from "react/cjs/react.development"

const Filter = ({ current, width, onCurrent }) => {

    const filter = ["all", "active", "completed"];

    function properCase(text) {
        return text[0].toUpperCase() + text.slice(1, text.length)
    }

    return (
        <div className={`filter ${width >= 768 && "inside"}`}>
            {filter.map(now => {
                return <span
                    key={filter.indexOf(now)}
                    onClick={onCurrent}
                    className={`${now} ${current === now ? "current" : ""}`}>
                    {properCase(now)}
                </span>
            })}
        </div>
    )
}

export default Filter

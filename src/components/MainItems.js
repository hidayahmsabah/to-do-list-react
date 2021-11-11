import { useState, useEffect, useCallback } from "react";
import update from 'immutability-helper';
import Lists from "./Lists";
import Filter from "./Filter";

const MainItems = ({ tasks, setTasks, current, width, onDelete, onToggle, onClear, onCurrent }) => {

    const [itemAmt, setItemAmt] = useState(0)

    useEffect(() => {
        //update item amount
        const completedItems = tasks.reduce((first, second) => {
            second.complete && first++;
            return first;
        }, 0)

        if (current === "completed") {
            setItemAmt(completedItems)
        }
        else {
            setItemAmt(tasks.length - completedItems)
        }
    }, [current, tasks])

    function wordingNumbers() {
        if (current !== "all") {
            if (itemAmt === 0) {
                return `No ${current} items`
            }
            else {
                return `${itemAmt} ${current} item(s)`
            }
        }
        else if (current === "all" && itemAmt > 0) {
            return `${itemAmt} item(s) left`
        }
        else {
            return "No items left"
        }
    }

    const moveCont = useCallback((dragIndex, hoverIndex) => {
        const dragCont = tasks[dragIndex];
        setTasks(update(tasks, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCont],
            ],
        }));
    }, [tasks]);

    return (
        <main className="lists">
            {tasks.map((task, index) => {
                return <Lists key={task.id}
                    index={index}
                    id={task.id}
                    task={task}
                    onDelete={onDelete}
                    onToggle={onToggle}
                    moveCont={moveCont}
                />
            })}
            <div className="last-row">
                <span className="items">{wordingNumbers()}</span>
                {width >= 768 &&
                    <Filter
                        current={current}
                        onCurrent={onCurrent}
                        width={width} />}
                <button className="clear" onClick={onClear}>Clear Completed</button>
            </div>
        </main>
    )
}

export default MainItems

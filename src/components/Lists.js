import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../utils/items';
import crossLogo from '../images/icon-cross.svg';

const Lists = ({ id, index, moveCont, task, onDelete, onToggle }) => {

    const ref = useRef(null);

    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.CONTAINER,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },

        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            moveCont(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CONTAINER,
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div className="list" ref={ref} data-handler-id={handlerId} style={{ opacity: isDragging ? 0.4 : 1 }}>
            <div className={`circle ${task.complete && "complete"}`}
                onClick={() => onToggle(task.id)}></div>
            <span className={`task ${task.complete ? "strikethrough" : ""}`}>{task.item}</span>
            <img className="delete" src={crossLogo} alt="" onClick={() => onDelete(task.id)} />
        </div >
    )
}

export default Lists


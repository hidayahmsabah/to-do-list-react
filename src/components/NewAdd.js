import React from 'react';
import crossLogo from '../images/icon-cross.svg'

const NewAdd = ({ onClick }, ref) => {

    return (
        <div className="new">
            <span className="circle"></span>
            <input type="text"
                ref={ref}
                className="text"
                placeholder="Create New Todo..."
                onKeyDown={(e) => e.key === 'Enter' && onClick()}
            />
            <img className="add" src={crossLogo} alt="" onClick={onClick} />
        </div>
    )
}

const ForwardNewAdd = React.forwardRef(NewAdd);

export default ForwardNewAdd;


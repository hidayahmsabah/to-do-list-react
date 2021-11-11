// import { useState, useEffect } from 'react';
import sunLogo from '../images/icon-sun.svg';
import moonLogo from '../images/icon-moon.svg';

const TodoHead = ({ theme, changeTheme }) => {

    return (
        <h1>
            TODO
            <img className="app-theme light" src={`${!theme || !theme.dark ? moonLogo : sunLogo}`}
                alt="Sun icon to change app to light theme"
                onClick={() => changeTheme()} />
        </h1>
    )
}

export default TodoHead

import React from 'react'
import { useUser } from '../../Contexts/user.jsx';
import { useSocket } from '../../Contexts/socket.jsx';
import {Link} from "react-router-dom"
import { useMobile } from "../../Contexts/mobile.jsx"

function Header() {
    const {socket} = useSocket();
    const {userState, token} = useUser();
    const {widthS} = useMobile();

    const logout = () => {
        socket.emit('disconnected', userState.user)
        document.cookie.split(';').map(c => {
            if(c.indexOf('auth-token') !== -1){
                document.cookie = 'auth-token=;max-age=0;path=/';
                localStorage.removeItem('user')
            }
        });
        window.location.pathname='/'
    }

    if(widthS === 'mobile') return <MobileHeader userState={userState} token={token} logout={logout} />
    else if(widthS.includes('medium')) return <MediumHeader userState={userState} token={token} logout={logout} />
    else return <LargeHeader userState={userState} token={token} logout={logout} />

}

const LargeHeader = ({userState, theme, token, logout}) => {

    return (
        <div id='header-pos' className={``}>
            <div id="header">
                <div id="title">
                    <Link className={`notranslate a-normalize `} to="/">Luccagram</Link>
                </div>
                {token ?
                <div id="header-nav">
                    <div id="nav-lspace"></div>
                    <div id="nav-btns">
                        <Link to='/' id="Home-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>
                            home
                        </span>
                            Inicio
                        </Link>
                        <Link to={userState ? `/user/${userState?.user}`: ''} id="Profile-btn" className={`a-normalize header-btn `}>
                            <span className={`material-icons notranslate gicon header-icon `}>
                                person
                            </span>
                            Perfil
                        </Link>
                        <Link to='/chat' id="chat-btn" className={`a-normalize header-btn `}>
                            <span className="material-icons notranslate gicon header-icon">mail</span>
                            Chats
                        </Link>
                        <Link to='/notifications' id="notification-btn" className={`a-normalize header-btn `}>
                            <span className={`material-icons notranslate gicon header-icon `}>notifications</span>
                            <div id="new-notification-div">
                                {userState?.newNotis > 0 ? <span id="new-notification">{userState?.newNotis}</span>:''}
                            </div>
                            Notificaciones
                        </Link>
                        <a onClick={logout} id="logout-btn" className={`a-normalize header-btn `}>
                        <span className={`material-icons notranslate gicon header-icon `}>logout</span>
                            Cerrar Sesión
                        </a>
                    </div>
                </div>:''}

                </div>
                
                {token ? <div id="account">
                    <div id="account-btn">
                    <img id="account-pic" src={userState ? userState?.profilePic : ''} alt={userState?.user} />
                    <div className='notranslate' id="account-user">
                        {userState?.user}
                    </div>
                    </div>
                </div>:''}
        </div>
        
    )

}

const MediumHeader = ({userState, theme, token, logout}) => {
    return (
        <div id='medium-header-pos' className={``}>
            <div id="header">
                <div id="title">
                    <Link className={`notranslate a-normalize `} to="/">L</Link>
                </div>
                {token ?
                <div id="header-nav">
                    <div id="medium-nav-btns">
                        <Link to='/' id="Home-btn" className={`a-normalize medium-header-btn `}>
                        <span className={`material-icons notranslate gicon medium-header-icon `}>
                            home
                        </span>
                        </Link>
                        <Link to={userState ? `/user/${userState?.user}`: ''} id="Profile-btn" className={`a-normalize medium-header-btn `}>
                            <span className={`material-icons notranslate gicon medium-header-icon `}>
                                person
                            </span>
                        </Link>
                        <Link to='/search' id="search-btn" className={`a-normalize medium-header-btn `}>
                            <span className={`material-icons notranslate gicon medium-header-icon `}>
                                search
                            </span>
                        </Link>
                        <Link to='/chat' id="chat-btn" className={`a-normalize medium-header-btn `}>
                            <span className="material-icons notranslate gicon medium-header-icon">mail</span>
                        </Link>
                        <Link to='/notifications' id="notification-btn" className={`a-normalize medium-header-btn `}>
                            <span className={`material-icons notranslate gicon medium-header-icon `}>
                                    notifications
                                </span>
                                <div id="new-notification-div">
                                    {userState?.newNotis > 0 ? <span id="new-notification">{userState?.newNotis}</span>:''}
                                </div>
                        </Link>
                        <a  onClick={logout} id="logout-btn" className={`a-normalize medium-header-btn `}>
                        <span className={`material-icons notranslate gicon medium-header-icon `}>logout</span>
                        </a>
                    </div>
                </div>:''}

                </div>
                
                {token ? <div id="account">
                    <div id="medium-account-btn">
                    <img id="account-pic" src={userState ? userState?.profilePic : ''} alt={userState?.user} />
                    <div className='notranslate' id="account-user"></div>
                    </div>
                </div>:''}
        </div>
        
    )
}

const MobileHeader = ({userState, theme, token, logout}) => {
    if(token){
        return(
            <>
            <div id='mobile-header-pos'>
                <Link to='/' id="Home-btn" className={`a-normalize mobile-header-btn `}>
                    <span className="material-icons notranslate gicon header-icon">
                        home
                    </span>
                </Link>
                <Link to='/search' id="search-btn" className={`a-normalize mobile-header-btn `}>
                    <span className="material-icons notranslate gicon header-icon">
                        search
                    </span>
                </Link>
                <Link to='/notifications' id="noti-btn" className={`a-normalize mobile-header-btn `}>
                    <span className="material-icons notranslate gicon header-icon">
                        notifications
                    </span>
                    <div id="new-notification-div">
                        {userState?.newNotis > 0 ? <span id="new-notification">{userState?.newNotis}</span>:''}
                    </div>
                </Link>
                <Link to='/chat' id="chat-btn" className={`a-normalize mobile-header-btn `}>
                    <span className="material-icons notranslate gicon header-icon">
                        mail
                    </span>
                </Link>
                <Link to={'/user/'+userState?.user} id="profile-btn" className={`a-normalize mobile-header-btn `}>
                    <img id="mobile-profile-btn-pic" className={`a-normalize mobile-header-btn `} src={userState?.profilePic} />
                </Link>
            </div>
            </>
        )
    }else return ''
}

export default Header
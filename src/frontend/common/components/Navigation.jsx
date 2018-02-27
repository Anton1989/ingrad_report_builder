import React from 'react';
import Link from 'react-router/lib/Link';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import browserHistory from 'react-router/lib/browserHistory';
import styles from './Navigation.scss';

export default class Navigation extends React.Component {

    constructor(...props) {
        super(...props);

        this.generateMenu = this.generateMenu.bind(this);
        this.goTo = this.goTo.bind(this);
    }

    generateMenu(menu = this.props.menu, parent) {
        return menu.map((item, i) => {
            let submenu = null;
            if (item.submenu.length > 0) {
                submenu = this.generateMenu(item.submenu, item);
            }

            if (item.isMapCategory) {
                return [
                    <NavItem key={item.url} className={styles.subjectMenu + ' ' + styles.onlyMobile}>{item.anchor}</NavItem>,
                    submenu ? submenu : null
                ];
            } else if (item.isPlace) {
                return <NavItem key={item.url} className={styles.onlyMobile} eventKey={i} onClick={() => { this.props.setPlace(parent.id, item.id) }}>
                    {item.anchor}
                </NavItem>;
            } else {
                return <NavItem key={item.url} className={styles.onlyMobile} eventKey={i} href={item.url} onClick={() => { this.goTo(item.url); }}>
                    {item.anchor}
                </NavItem>;
            }
        })
    }

    goTo(url) {
        browserHistory.push(url);
    }

    render() {
        const { placeObj } = this.props;
        console.log('RENDER <Navbar>');

        let title = <Link to='/' className='navbar-brand'>ИНГРАД - карта</Link>;
        if (placeObj) {
            title = <Link className='navbar-brand'>
                <img src={placeObj.logo} height='20' className={styles.logo} /><Link to='/'>Карта</Link> | {placeObj.name}
            </Link>
        }

        return <Navbar collapseOnSelect fixedTop fluid className={styles.mobile}>
            <Navbar.Header>
                <Navbar.Brand>
                    {title}
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight className={styles.mobileMenu}>
                    {this.generateMenu()}
                </Nav>
            </Navbar.Collapse>
        </Navbar>;
    }
}
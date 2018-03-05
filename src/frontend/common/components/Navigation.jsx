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

    generateMenu() {
        const { menu } = this.props;
        return menu.map((item, i) => {
            return <NavItem key={item.url} eventKey={i} href={item.url} onClick={() => { this.goTo(item.url); }}>
                {item.anchor}
            </NavItem>;
        })
    }

    goTo(url) {
        browserHistory.push(url);
    }

    render() {
        console.log('RENDER <Navbar>');

        return <Navbar collapseOnSelect fixedTop fluid>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link to='/' className='navbar-brand'>ИНГРАД - админ панель</Link>
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
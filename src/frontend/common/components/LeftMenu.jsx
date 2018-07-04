import React from 'react';
import PropTypes from 'prop-types';
//Components
import Link from 'react-router/lib/Link';
import styles from './LeftMenu.scss';

export default class LeftMenu extends React.Component {

    constructor(...props) {
        super(...props);

        this.state = {
            extendedMenus: []
        }

        this.onExtend = this.onExtend.bind(this);
        this.generateMenu = this.generateMenu.bind(this);
    }

    onExtend(anchor) {
        if (this.state.extendedMenus.find(item => item == anchor))
            this.setState({ extendedMenus: this.state.extendedMenus.filter(item => anchor != item) });
        else
            this.setState({ extendedMenus: this.state.extendedMenus.concat([anchor]) });
    }

    generateMenu(menu, isActive, parent) {
        const { setMapType, setPlace } = this.props;

        return menu.map(item => {
            let submenu = null;
            if (item.submenu.length > 0) {
                submenu = this.generateMenu(item.submenu, isActive, item);
            }

            let li = null;
            if (item.isMapCategory) {
                let checkbox = 'glyphicon-unchecked';
                if (item.active) {
                    checkbox = 'glyphicon-check';
                }
                li = <li key={item.anchor}>
                    <a className={styles.expandedMenu} onClick={() => { setMapType(item.id) }}><span className={'glyphicon ' + checkbox}></span> {item.anchor}</a>
                    {submenu ? <ul className={styles.navSidebar + ' ' + styles.submenu + ' nav submenu nav-sidebar'}>{submenu}</ul> : null}
                </li>;
            } else if (item.isPlace) {
                li = <li key={item.anchor}>
                    <a className={styles.expandedMenu} onClick={() => { setPlace(parent.id, item.id) }}>{item.anchor}</a>
                </li>;
            } else {
                const active = item.url ? isActive(item.url, item.strict) ? styles.active : '' : '';
                li = <li key={item.anchor} className={active}>
                    <Link to={item.url ? (CORE_URL + item.url) : null}>{item.anchor}</Link>
                    {submenu ? <ul className={styles.navSidebar + ' ' + styles.submenu + ' nav submenu nav-sidebar'}>{submenu}</ul> : null}
                </li>;
            }

            return li
        })
    }

    render() {
        console.log('RENDER <LeftMenu>');
        const { menu, isActive } = this.props;

        return <div id='menu' className={styles.sidebar + ' col-sm-3 col-md-2 sidebar'}>
            <ul className={styles.navSidebar + ' nav nav-sidebar'}>
                {menu.length > 0 && this.generateMenu(menu, isActive)}
            </ul>
        </div>
    }
}
LeftMenu.propTypes = {
    menu: PropTypes.array.isRequired,
    isActive: PropTypes.func.isRequired,
    setMapType: PropTypes.func,
    setPlace: PropTypes.func
}

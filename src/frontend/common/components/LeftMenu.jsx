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
    generateMenu(menu, isActive) {
        return menu.map(item => {
            let onExtend = null;
            let submenu = null;
            if (item.submenu.length > 0) {
                item.url = item.submenu.length > 0 ? null : item.url;
                onExtend = item.submenu.length > 0 ? () => this.onExtend.call(this, item.anchor) : onExtend;
                submenu = this.generateMenu(item.submenu, isActive);
            }
            const active = item.url ? isActive(item.url, item.strict) ? 'active' : '' : '';

            return <li key={item.anchor} className={active}>
                <Link onClick={onExtend} to={item.url ? item.url : null}>{item.anchor}</Link>
                {submenu ? <ul className={styles.navSidebar + ' nav submenu nav-sidebar'}>{submenu}</ul> : null}
            </li>
        })
    }
    generateBackButton(name) {
        return <li><div className='btn-back'>
            <Link className='btn btn-default' to={process.env.CORE_URL+'dashboard'}><img src={process.env.CORE_URL+'images/back.png'} /></Link>
            <div className='btn-note'>{name}</div>
        </div></li>
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
    isActive: PropTypes.func.isRequired
}
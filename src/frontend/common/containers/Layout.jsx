import React from 'react';
import connect from 'react-redux/lib/connect/connect';
//Components
import Navbar from '../components/Navigation.jsx';
import LeftMenu from '../components/LeftMenu.jsx';
import styles from './Layout.scss';

class Layout extends React.Component {
	constructor(...props) {
		super(...props)
	}
	render() {
		console.log('RENDER <Layout>');
		const { isActive } = this.props;

		let menu = [
			{
				anchor: 'Проекты',
				url: '/projects',
				strict: false,
				submenu: []
			},
			{
				anchor: 'Карта',
				url: '/map',
				strict: false,
				submenu: []
			},
			{
				anchor: 'Конструктор',
				url: '/builder',
				strict: false,
				submenu: []
			}
		];

		return <div className='container-fluid'>
            <Navbar />
			<LeftMenu menu={menu} isActive={isActive} />
			<div className='row'>
				<div className={styles.main + ' col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2'}>
					{this.props.children}
				</div>
			</div>
        </div>
	}
}

function mapStateToProps (state, routerProps) {
	return {
		isActive: routerProps.router.isActive,
		user: state.user
	}
}

export default connect(mapStateToProps)(Layout)

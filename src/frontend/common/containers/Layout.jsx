import React from 'react';
import connect from 'react-redux/lib/connect/connect';
//Components
import Navbar from '../components/Navigation.jsx';
import LeftMenu from '../components/LeftMenu.jsx';
import styles from './Layout.scss';

class Layout extends React.Component {

	constructor(...props) {
		super(...props);

		this.state = {
			activeTypes: [
				'inner_msc',
				'out_msc',
				'office'
			],
			place: null,
			type: null
		};

		this.handleSetMapType = this.handleSetMapType.bind(this);
		this.handleSetPlace = this.handleSetPlace.bind(this);
	}

	componentWillReceiveProps() {
		console.log('componentWillReceiveProps');
		this.setState({ place: null, type: null });
	}

	// componentWillUpdate() {
	// 	console.log('componentWillUpdate');
	// }

	handleSetMapType(type) {
		let activeTypes = [...this.state.activeTypes];
		if (this.state.activeTypes.indexOf(type) !== -1) {
			activeTypes.splice(this.state.activeTypes.indexOf(type), 1);
		} else {
			activeTypes.push(type);
		}
		this.setState({ activeTypes, place: null, type: null });
	}

	handleSetPlace(type, id) {
		this.setState({ place: id, type });
	}

	render() {
		const { isActive, children } = this.props;
		console.log('RENDER <Layout>');

		const isMapPage = isActive('/map', false); 
		
		let menu = [
			{
				anchor: 'Карта',
				url: '/',
				strict: true,
				submenu: []
			},
			{
				anchor: 'Стили Карты',
				url: '/styles',
				strict: true,
				submenu: []
			},
			{
				anchor: 'Стили KPI таблиц',
				url: '/kpi-styles',
				strict: true,
				submenu: []
			},
			{
				anchor: 'Проектная декларация',
				url: '/pd',
				strict: true,
				submenu: []
			},
			{
				anchor: 'KPI таблицы',
				url: '/kpi',
				strict: false,
				submenu: []
			}
		];

		var childrenWithProps = React.Children.map(children, child =>
			React.cloneElement(child, {
				activeTypes: this.state.activeTypes,
				openPlace: this.handleSetPlace,
				placeId: isMapPage ? this.state.place : null,
				type: isMapPage ? this.state.type : null
			}));

		const showMenu = !isMapPage || (!this.state.place && !this.props.params.placeId);
		let classMain = ' col-sm-12 col-sm-offset-0 col-md-12 col-md-offset-0';
		if (showMenu) {
			classMain = ' col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2';
		}
		return <div className='container-fluid'>
			<Navbar
				menu={menu}
				setMapType={this.handleSetMapType}
				setPlace={this.handleSetPlace} />
			{showMenu && <LeftMenu
				menu={menu}
				isActive={isActive}
				setMapType={this.handleSetMapType}
				setPlace={this.handleSetPlace} />}
			<div className='row'>
				<div className={styles.main + classMain}>
					{childrenWithProps}
				</div>
			</div>
		</div>
	}
}

function mapStateToProps(state, routerProps) {
	return {
		isActive: routerProps.router.isActive
	}
}

export default connect(mapStateToProps)(Layout)

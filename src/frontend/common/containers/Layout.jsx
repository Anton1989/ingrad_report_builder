import React from 'react';
import connect from 'react-redux/lib/connect/connect';
//Components
import Navbar from '../components/Navigation.jsx';
import LeftMenu from '../components/LeftMenu.jsx';
import styles from './Layout.scss';

const markersTypes = [
	{
		id: 'inner_msc',
		anchor: 'Москва',
		url: '/map/inner_msc',
		active: true,
		isMapCategory: true,
		strict: true,
		submenu: []
	},
	{
		id: 'out_msc',
		anchor: 'Московская область',
		url: '/map/out_msc',
		active: true,
		isMapCategory: true,
		strict: true,
		submenu: []
	},
	{
		id: 'office',
		anchor: 'Офис',
		url: '/map/office',
		active: true,
		isMapCategory: true,
		strict: true,
		submenu: []
	}
];

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

	generateMapSubMenu(places) {
		return markersTypes.map(type => {
			let locationType = { ...type };
			locationType.active = this.state.activeTypes.indexOf(locationType.id) !== -1;
			if (locationType.active) {
				locationType.submenu = places.filter(place => place.location == type.id).map(place => {
					return {
						id: place._id,
						anchor: place.name,
						url: type.url + '/' + place._id,
						isPlace: true,
						strict: false,
						submenu: []
					};
				});
			}
			return locationType;
		})
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
		const { isActive, places, children } = this.props;
		console.log('RENDER <Layout>');

		const isMapPage = isActive('/map', false); 

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
				strict: true,
				submenu: (places.data.length > 0 && isMapPage) ? this.generateMapSubMenu(places.data) : []
			}
		];

		var childrenWithProps = React.Children.map(children, child =>
			React.cloneElement(child, {
				activeTypes: this.state.activeTypes,
				openPlace: this.handleSetPlace,
				placeId: isMapPage ? this.state.place : null,
				type: isMapPage ? this.state.type : null
			}));

		return <div className='container-fluid'>
			<Navbar />
			<LeftMenu
				menu={menu}
				isActive={isActive}
				setMapType={this.handleSetMapType}
				setPlace={this.handleSetPlace} />
			<div className='row'>
				<div className={styles.main + ' col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2'}>
					{childrenWithProps}
				</div>
			</div>
		</div>
	}
}

function mapStateToProps(state, routerProps) {
	return {
		isActive: routerProps.router.isActive,
		places: state.places
	}
}

export default connect(mapStateToProps)(Layout)

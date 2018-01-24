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
			]
		};

		this.handleSetMapType = this.handleSetMapType.bind(this);
	}

	generateMapSubMenu(places) {
		return markersTypes.map(type => {
			let locationType = { ...type };
			locationType.active = this.state.activeTypes.indexOf(locationType.id) !== -1;
			if (locationType.active) {
				locationType.submenu = places.filter(place => place.location == type.id).map(place => {
					return {
						anchor: place.name,
						url: type.url + '/' + place._id,
						strict: false,
						submenu: []
					};
				});
			}
			return locationType;
		})
	}

	handleSetMapType(type) {
		let activeTypes = [...this.state.activeTypes];
		if (this.state.activeTypes.indexOf(type) !== -1) {
			activeTypes.splice(this.state.activeTypes.indexOf(type), 1);
		} else {
			activeTypes.push(type);
		}
		this.setState({activeTypes});
	}

	render() {
		const { isActive, places, children } = this.props;
		console.log('RENDER <Layout>');

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
				submenu: (places.data.length > 0 && isActive('/map', false)) ? this.generateMapSubMenu(places.data) : []
			}
		];

		var childrenWithProps = React.Children.map(children, child =>
			React.cloneElement(child, { activeTypes: this.state.activeTypes }));

		return <div className='container-fluid'>
			<Navbar />
			<LeftMenu menu={menu} isActive={isActive} setMapType={this.handleSetMapType} />
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

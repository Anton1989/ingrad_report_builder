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
		strict: true,
		submenu: []
	},
	{
		id: 'out_msc',
		anchor: 'Московская область',
		url: '/map/out_msc',
		strict: true,
		submenu: []
	},
	{
		id: 'office',
		anchor: 'Офис',
		url: '/map/office',
		strict: true,
		submenu: []
	}
];

class Layout extends React.Component {

	constructor(...props) {
		super(...props)
	}

	generateMapSubMenu(places) {
		return markersTypes.map(type => {
			let locationType = { ...type };
			locationType.submenu = places.filter(place => place.location == type.id).map(place => {
				return {
					anchor: place.name,
					url: type.url + '/' + place._id,
					strict: false,
					submenu: []
				};
			});
			return locationType;
		})
	}

	render() {
		const { isActive, places } = this.props;
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
				submenu: places.data.length > 0 ? this.generateMapSubMenu(places.data) : []
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

function mapStateToProps(state, routerProps) {
	return {
		isActive: routerProps.router.isActive,
		places: state.places
	}
}

export default connect(mapStateToProps)(Layout)

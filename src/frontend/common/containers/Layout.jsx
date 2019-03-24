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
		url: '/inner_msc',
		active: true,
		isMapCategory: true,
		strict: true,
		submenu: []
	},
	{
		id: 'out_msc',
		anchor: 'Московская область',
		url: '/out_msc',
		active: true,
		isMapCategory: true,
		strict: true,
		submenu: []
	},
	{
		id: 'office',
		anchor: 'Офис',
		url: '/office',
		active: true,
		isMapCategory: true,
		strict: true,
		submenu: []
	},
	{
		id: 'add',
		anchor: 'Добавить',
		url: '/add',
		active: true,
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
			type: null,
			showMenu: false
		};

		this.handleSetMapType = this.handleSetMapType.bind(this);
		this.handleSetPlace = this.handleSetPlace.bind(this);
		this.handleShowMenu = this.handleShowMenu.bind(this);
	}

	generateMapMenu(places) {
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

	handleShowMenu() {
		this.setState({ showMenu: !this.state.showMenu });
	}

	render() {
		const { isActive, places, children, params: { id } } = this.props;
		console.log('RENDER <Layout>');
		
		let menu = this.generateMapMenu(places.data);

		var childrenWithProps = React.Children.map(children, child =>
			React.cloneElement(child, {
				activeTypes: this.state.activeTypes,
				openPlace: this.handleSetPlace,
				placeId: this.state.place,
				type: this.state.type
			})
		);

		let placeObj = null;
		if (this.state.place || id) {
			placeObj = places.data.find(place => (place._id == this.state.place || place._id == id));
		}

		const showMenu = !this.state.place && !this.props.params.placeId && !id && this.state.showMenu;
		let classMain = ' col-sm-12 col-sm-offset-0';
		// if (showMenu) {
		// 	classMain = ' col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2';
		// }
		return <div className='container-fluid'>
			<Navbar
				placeObj={placeObj}
				menu={menu}
				handleShowMenu={this.handleShowMenu}
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
		isActive: routerProps.router.isActive,
		places: state.places
	}
}

export default connect(mapStateToProps)(Layout)

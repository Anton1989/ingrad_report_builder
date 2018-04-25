import React from 'react';
import connect from 'react-redux/lib/connect/connect';
//Components
// import Navbar from '../components/Navigation.jsx';
// import LeftMenu from '../components/LeftMenu.jsx';
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

		var childrenWithProps = React.Children.map(children, child =>
			React.cloneElement(child, {
				activeTypes: this.state.activeTypes,
				openPlace: this.handleSetPlace,
				placeId: isMapPage ? this.state.place : null,
				type: isMapPage ? this.state.type : null
			}));

		let classMain = ' col-sm-12';

		return <div className='container-fluid'>
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

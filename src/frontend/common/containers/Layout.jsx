import React from 'react';
import connect from 'react-redux/lib/connect/connect';
//Components
// import Navbar from '../components/Navigation.jsx';
// import LeftMenu from '../components/LeftMenu.jsx';
import styles from './Layout.scss';

class Layout extends React.Component {

	render() {
		const { children } = this.props;
		console.log('RENDER <Layout>');

		return <div className={'container-fluid ' + styles.main}>
			{children}
		</div>
	}
}

function mapStateToProps(state, routerProps) {
	return {
		isActive: routerProps.router.isActive
	}
}

export default connect(mapStateToProps)(Layout)

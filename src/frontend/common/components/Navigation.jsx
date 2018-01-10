import React from 'react';
import Link from 'react-router/lib/Link';

export default class Navbar extends React.Component {
    render() {
        console.log('RENDER <Navbar>');

        return <nav className='navbar navbar-inverse navbar-fixed-top'>
            <div className='navbar-header'>
                <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
                    <span className='sr-only'>Toggle navigation</span>
                    <span className='icon-bar'></span>
                    <span className='icon-bar'></span>
                    <span className='icon-bar'></span>
                </button>
                <Link to='/' className='navbar-brand'>ИНГРАД - проекты</Link>
            </div>
        </nav>
    }
}
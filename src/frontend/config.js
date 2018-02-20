const config = {
    apiConfig: {
        getProjectsUrl: '/v1/projects',
        getPlacesUrl: '/v1/places',
        getStylesUrl: '/v1/styles'
    },
    defaultVars: {
        menu: [
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
				submenu: []
			}
		]
    }
    // departmentURL: 'http://www.mocky.io/v2/5941836a0f0000150fc63261',
    // employeeURL: 'http://www.mocky.io/v2/5941c5440f0000a814c632bc'
}
export default config;

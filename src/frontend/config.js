const config = {
    apiConfig: {
        getDocsUrl: '/v1/docs'
	},
	types: [
		'РнС1',
		'РнС2',
		'РнС3'
	],
	projects: [
		{
			name: 'МИХАЙЛОВА 31',
			objects: [
				'МИХАЙЛОВА - Строение 1',
				'МИХАЙЛОВА - Строение 2',
				'МИХАЙЛОВА - Строение 3'
			],
		},
		{
			name: 'ЛЕСОПАРКОВАЯ',
			objects: [
				'ЛЕСОПАРКОВАЯ - Строение 1',
				'ЛЕСОПАРКОВАЯ - Строение 2',
				'ЛЕСОПАРКОВАЯ - Строение 3'
			],
		},
		{
			name: 'ВАВИЛОВА',
			objects: [
				'ВАВИЛОВА - Строение 1',
				'ВАВИЛОВА - Строение 2',
				'ВАВИЛОВА - Строение 3'
			],
		}
	],
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

const config = {
    apiConfig: {
        getProjectsUrl: '/v1/projects',
        getPlacesUrl: '/v1/places',
        getStylesUrl: '/v1/styles',
        generatePdUrl: '/v1/pd',
		getKpiUrl: '/v1/kpi',
		getDocsUrl: '/v1/docs'
    },
    defaultVars: {
		ktNames: {
			'ЗУ': 'Земельный участок',
			'ГК/ГП': 'Градостроительная концепция/ Градостроительный потенциал',
			'ИИ_П_Дог': 'Инженерные изыскания_Договор (проект)',
			'ИИ_П': 'Инженерные изыскания (проект)',
			'ИИ_ТЗ': 'Инженерные изыскания_ТЗ',
			'ИИ_Тендер': 'Инженерные изыскания_Тендер',
			'ИИ_Дог': 'Инженерные изыскания_Договор',
			'ИИ': 'Инженерные изыскания',
			'ТУ': 'Технические условия',
			'СТУ': 'Спец. ТУ',
			'ТУ_пр': 'Технические условия (предварительные)',
			'ТУ_П': 'Технические условия (проект)',
			'ГК_ППТ_ТЗ': 'ГК, ППТ, ПМТ_ТЗ на тендер',
			'ГК_ППТ_Тендер': 'ГК, ППТ, ПМТ_Тендер',
			'ГК_ППТ_Дог': 'ГК, ППТ, ПМТ_Договор',
			'ППТ': 'Проекты планировки и межевания территории',
			'ГЗК': 'Утв. ТЭПов на ГЗК',
			'ГПЗУ_П': 'Градостроительный план земельного участка (проект)',
			'ГПЗУ': 'Градостроительный план земельного участка',
			'ВРИ': 'Изменение ВРИ',
			'АГК_ТЗ': 'АГК_Подготовка ТЗ',
			'АГК_Тендер': 'АГК_Проведение тендера',
			'АГК_Дог': 'АГК_Заключение договора',
			'АГК': 'Архитектурно-градостроительная концепция',
			'ГПр_ТЗ': 'Генпроектирование_ТЗ на тендер',
			'ГПр_Тендер': 'Генпроектирование_Тендер',
			'ГПр_Дог': 'Генпроектирование_Договор',
			'ПД_ТЗ': 'Проектная документация ст.П_ТЗ',
			'ПД_Тендер': 'Проектная документация ст. П_Тендер',
			'ПД_Дог': 'Проектная документация стадии П_Договор',
			'ПД': 'Проектная документация стадии П',
			'Эксп_Дог': 'Экспертиза_Договор',
			'Эксп': 'Экспертиза ПД, ИИ',
			'АГО/АГР': 'Архитектурно-градостроительный облик/решения',
			'РнС': 'Разрешение на строительство',
			'ОП_АК': 'Концепция офиса продаж',
			'ОП_РД': 'Проектирование офиса продаж',
			'ОП': 'Открытие офиса продаж',
			'ОП_ТЗ': 'Офис продаж_ТЗ на тендер',
			'ОП_Тендер': 'Офис продаж_Тендер',
			'ОП_Дог': 'Офис продаж_Договор',
			'ЗОС_ПД': 'Заключение о соответствии РД',
			'СП': 'Старт продаж',
			'ДБ': 'Подписание договора бронирования',
			'ДДУ_1': 'Регистрация 1ого ДДУ',
			'СП_2': 'остальные точки для старта продаж',
			'Реал': 'Подготовка проекта к реализации',
			'РД_ТЗ': 'Рабочая документация_ТЗ',
			'РД_Тендер': 'Рабочая документация_Тендер',
			'РД_Дог': 'Рабочая документация_Договор',
			'РД': 'Рабочая документация',
			'СМР_ТЗ': 'Строительно-монтажные работы_ТЗ',
			'СМР_Тендер': 'Строительно-монтажные работы_Тендер',
			'СМР_Дог': 'Строительно-монтажные работы_Договор',
			'Ордер': 'Ордер (подготовительный период)',
			'СМР_Подг': 'СМР подготовительный период',
			'СМР_Вынос_ТЗ': 'Подготовка тендерной документация_Вынос сетей',
			'СМР_Вынос_Тендер': 'Проведение тендера_Вынос сетей',
			'СМР_Вынос_Дог': 'ЗАключение договора_Вынос сетей',
			'СМР_Вынос': 'СМР вынос сетей',
			'СМР': 'СМР (единый подрядчик)',
			'СМР ниже 0': 'Строительно-монтажные работы нулевого цикла',
			'СМР выше 0': 'Строительно-монтажные работы выше 0',
			'СМР_Окна': 'СМР Окна',
			'СМР_Фасад': 'СМР Фасады',
			'СМР_Лифты': 'СМР Лифты',
			'СМР_отд': 'СМР Отделочные работы МОП',
			'СМР_ВС': 'СМР Внутренние сети',
			'СМР_ТП': 'Подключение по постоянной схеме',
			'СМР_НС_ТЗ': 'Наружные сети_ТЗ на тендер',
			'СМР_НС_Тендер': 'Наружные сети_Тендер',
			'СМР_НС_Дог': 'Наружные сети_Договор',
			'СМР_НС': 'СМР Наружные сети (КТ)',
			'СМР_Бл-во_ТЗ': 'Благоустройство_ТЗ на тендер',
			'СМР_Бл-во_Тендер': 'Благоустройство_Тендер',
			'СМР_Бл-во_Дог': 'Благоустройство_Договор',
			'СМР_Бл-во': 'СМР Благоустройство (КТ)',
			'ЗОС': 'Заключение о соответствии',
			'РнВ': 'Разрешение на ввод объекта в эксплуатацию',
			'ЭУК': 'ЭУК (Передача в эксплуатацию)',
			'ДДУ': 'Получение актов ДДУ',
			'Отд_кв_ТЗ': 'Отделка квартир_ТЗ',
			'Отд_кв_Тендер': 'Отделка квартир_Тендер',
			'Отд_кв_Дог': 'Отделка квартир_Договор',
			'Отд_кв': 'Отделка квартир СМР'
		},
		kt: {
			'ЗУ': {
				name: 'Приобретение/аренда земельного участка или ЮЛ (доли)',
				kts: [
					'ЗУ'
				]
			},
			'ГК/ГП': {
				name: 'Градконцепция / Градпотенциал',
				kts: [
					'ГК/ГП'
				]
			},
			'ИИ': {
				name: 'Инженерные изыскания',
				kts: [
					'ИИ_П_Дог',
					'ИИ_П',
					'ИИ_ТЗ',
					'ИИ_Тендер',
					'ИИ_Дог',
					'ИИ'
				]
			},
			'ТУ': {
				name: 'Технические условия',
				kts: [
					'ТУ',
					'СТУ',
					'ТУ_пр',
					'ТУ_П'
				]
			},
			'ППТ': {
				name: 'Проект планировки территории',
				kts: [
					'ГК_ППТ_ТЗ',
					'ГК_ППТ_Тендер',
					'ГК_ППТ_Дог',
					'ППТ'
				]
			},
			'ГЗК': {
				name: 'Градостроительно-земельная комиссия г. Москвы',
				kts: ['ГЗК']
			},
			'ГПЗУ': {
				name: 'Градостроительный план земельного участка',
				kts: ['ГПЗУ_П', 'ГПЗУ']
			},
			'ВРИ': {
				name: 'Изменение вида разрешенного использования или категории ЗУ',
				kts: ['ВРИ']
			},
			'АК': {
				name: 'Архитектурная концепция',
				kts: [
					'АГК_ТЗ',
					'АГК_Тендер',
					'АГК_Дог',
					'АГК'
				]
			},
			'ПД_Дог': {
				name: 'Договор на разработку проектной документации',
				kts: [
					'ГПр_ТЗ',
					'ГПр_Тендер',
					'ГПр_Дог',
					'ПД_ТЗ',
					'ПД_Тендер',
					'ПД_Дог'
				]
			},
			'ПД': {
				name: 'Проектная документация стадии "П"',
				kts: ['ПД']
			},
			'Эксп': {
				name: 'Заключение экспертизы',
				kts: ['Эксп_Дог', 'Эксп']
			},
			'АГО/АГР': {
				name: 'Архитектурно-градостроительный облик/решение',
				kts: ['АГО/АГР']
			},
			'РнС': {
				name: 'Разрешение на строительство',
				kts: ['РнС']
			},
			'ОП': {
				name: 'Офис продаж',
				kts: [
					'ОП_АК',
					'ОП_РД',
					'ОП',
					'ОП_ТЗ',
					'ОП_Тендер',
					'ОП_Дог'
				]
			},
			'ЗОС_ПД': {
				name: 'Заключение о соответствии проектной декларации ФЗ214',
				kts: [
					'ЗОС_ПД'
				]
			},
			'СП': {
				name: 'Старт продаж',
				kts: [
					'СП',
					'ДБ',
					'ДДУ_1',
					'СП_2',
					'Реал'
				]
			},
			'РД': {
				name: 'Проектная документация стадии "Р"',
				kts: [
					'РД_ТЗ',
					'РД_Тендер',
					'РД_Дог',
					'РД'
				]
			},
			'СМР_Дог': {
				name: 'Договор на строительно-монтажные работы',
				kts: [
					'СМР_ТЗ',
					'СМР_Тендер',
					'СМР_Дог'
				]
			},
			'СМР': {
				name: 'Строительно-монтажные работы',
				kts: [
					'Ордер',
					'СМР_Подг',
					'СМР_Вынос_ТЗ',
					'СМР_Вынос_Тендер',
					'СМР_Вынос_Дог',
					'СМР_Вынос',
					'СМР',
					'СМР ниже 0',
					'СМР выше 0',
					'СМР_Окна',
					'СМР_Фасад',
					'СМР_Лифты',
					'СМР_отд',
					'СМР_ВС',
					'СМР_ТП',
					'СМР_НС_ТЗ',
					'СМР_НС_Тендер',
					'СМР_НС_Дог',
					'СМР_НС',
					'СМР_Бл-во_ТЗ',
					'СМР_Бл-во_Тендер',
					'СМР_Бл-во_Дог',
					'СМР_Бл-во'
				]
			},
			'ЗОС': {
				name: 'Заключение о соответствии построенного объекта проектной документации',
				kts: ['ЗОС']
			},
			'РнВ': {
				name: 'Разрешение на ввод в эксплуатацию',
				kts: ['РнВ']
			},
			'ЭУК/БАЛАНС': {name: 'Акт приема-передачи объекта УЭК или балансодержателю', kts: ['ЭУК']},
			'АКТ_ДДУ': {
				name: 'Акт приема-передачи объекта по ДДУ',
				kts: ['ДДУ']
			},
			'ОТД_КВ': {
				name: '',
				kts: [
					'Отд_кв_ТЗ',
					'Отд_кв_Тендер',
					'Отд_кв_Дог',
					'Отд_кв'
				]
			}
		},
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
module.exports = config;

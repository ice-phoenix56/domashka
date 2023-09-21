let jsonData; // Переменная для хранения JSON-данных

    // Функция для отображения всех данных JSON-файла на странице
    function displayAllData() {
      if (!jsonData) {
        alert('JSON-данные не загружены.');
        return;
      }
      document.getElementById('jsonOutput').textContent = JSON.stringify(jsonData, null, 2);
      console.log('Все данные:', jsonData);
      const moscowLoads = Object.values(jsonData)[0].filter(item => item.title === 'Москва Восток');
      console.log("Все данные с Москва Восток", moscowLoads)
    }

// Функция для фильтрации и отображения грузов из Москвы
function filterMoscowLoads() {
  alert("Чтобы узнать больше информаций о точке нажмите на метку")
  if (!jsonData) {
    alert('JSON-данные не загружены.');
    return;
  }

  if (typeof jsonData !== 'object') {
    alert('JSON-данные не являются объектом.');
    return;
  }

  // Фильтр для "Москва Восток"
  const moscowVostok = jsonData.branches.find(branch => branch.title === 'Москва Восток');

  if (!moscowVostok) {
    console.log('Москва Восток не найдена в данных.');
    return;
  }

  // Получите массив складов (warehouses) для "Москва Восток"
  const moscowVostokWarehouses = moscowVostok.divisions.map(division => division.warehouses).flat();
console.log("Все склады в Москве Восток: ", moscowVostokWarehouses)
  // Создайте карту на вашей странице
  ymaps.ready(function () {
    var myMap = new ymaps.Map('map', {
      center: [55.755814, 37.617635], // Координаты центра карты
      zoom: 10 // Масштаб карты
    });

    // Пройдитесь по каждому складу и добавьте метку на карту
    moscowVostokWarehouses.forEach(warehouse => {
      var coordinates = warehouse.coordinates.split(',').map(Number); // Преобразуйте строку координат в массив чисел
      
      // Создайте метку для склада
var myPlacemark = new ymaps.Placemark(
  coordinates, // Координаты метки
  {
    // Дополнительная информация о метке
    name: warehouse.name,
    phone: warehouse.telephone,
    email: warehouse.email,
    coordinates: warehouse.coordinates,
    adress: warehouse.address
  },
  {
    // Опции для метки
    iconLayout: 'default#imageWithContent',
    iconImageHref: 'https://pngicon.ru/file/uploads/geometka.png', // Путь к изображению иконки
    iconImageSize: [30, 35], // Размеры изображения
    iconImageOffset: [-15, -42], // Смещение изображения
    hideIconOnBalloonOpen: false, // Оставить иконку видимой при открытии балуна
    balloonContentLayout: ymaps.templateLayoutFactory.createClass(
      '<div class="balloon">' +
        '<b>{{ properties.name }}</b><br>' +
        'Телефон: {{ properties.phone }}<br>' +
        'Email: {{ properties.email }}<br>' +
        'Координаты: {{ properties.coordinates }}<br>' +
        'Адрес: {{ properties.adress }}' +
        '</div>'
    )
  }
);

      // Добавьте метку на карту
      myMap.geoObjects.add(myPlacemark);
    });
  });
}
  

    document.getElementById('jsonFileInput').addEventListener('change', function (event) {
      const file = event.target.files[0];

      if (!file) {
        alert('Файл не выбран.');
        return;
      }

      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;

        try {
          jsonData = JSON.parse(content);
          displayAllData(); // Отображение всех данных JSON-файла

          // Добавление обработчика для кнопки "Фильтровать грузы из Москвы"
          document.getElementById('filterButton').addEventListener('click', filterMoscowLoads);
        } catch (error) {
          alert('Произошла ошибка при парсинге JSON: ' + error.message);
        }
      };

      reader.readAsText(file);
      
    })
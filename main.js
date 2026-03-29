/**
 * 주변 기름값 안내 - Main Logic
 */

// --- Constants & State ---
let map;
let userMarker;
let stationMarkers = [];
let stationOverlays = [];
let currentPosition = { lat: 37.5665, lng: 126.9780 }; // Default: Seoul City Hall
const mockStations = [
    { id: 1, name: "강남주유소", brand: "SK에너지", price: 1580, lat: 37.4979, lng: 127.0276, distance: 0.5 },
    { id: 2, name: "서초제일주유소", brand: "GS칼텍스", price: 1565, lat: 37.4879, lng: 127.0176, distance: 1.2 },
    { id: 3, name: "역삼주유소", brand: "S-OIL", price: 1595, lat: 37.5079, lng: 127.0376, distance: 0.8 },
    { id: 4, name: "도곡셀프주유소", brand: "현대오일뱅크", price: 1550, lat: 37.4912, lng: 127.0423, distance: 1.5 },
    { id: 5, name: "양재주유소", brand: "알뜰주유소", price: 1530, lat: 37.4812, lng: 127.0323, distance: 1.8 },
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupEventListeners();
    getCurrentLocation();
});

function initMap() {
    const mapContainer = document.getElementById('map');
    const mapOption = {
        center: new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng),
        level: 4
    };

    map = new kakao.maps.Map(mapContainer, mapOption);

    // Zoom controls
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
}

function setupEventListeners() {
    document.getElementById('refresh-btn').addEventListener('click', () => {
        fetchStations(currentPosition.lat, currentPosition.lng);
    });

    document.getElementById('current-location-btn').addEventListener('click', () => {
        getCurrentLocation();
    });

    document.getElementById('oil-type').addEventListener('change', () => {
        fetchStations(currentPosition.lat, currentPosition.lng);
    });

    document.getElementById('sort-type').addEventListener('change', () => {
        renderStationList(mockStations); // Sorting logic can be added here
    });
}

// --- Functions ---

/**
 * Get user's current GPS location
 */
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                currentPosition = { lat, lng };
                
                const moveLatLon = new kakao.maps.LatLng(lat, lng);
                map.setCenter(moveLatLon);

                updateUserMarker(moveLatLon);
                fetchStations(lat, lng);
            },
            (error) => {
                console.error("Error getting location: ", error);
                alert("위치 정보를 가져올 수 없습니다. 기본 위치로 표시합니다.");
                fetchStations(currentPosition.lat, currentPosition.lng);
            }
        );
    } else {
        alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
        fetchStations(currentPosition.lat, currentPosition.lng);
    }
}

function updateUserMarker(position) {
    if (userMarker) userMarker.setMap(null);

    userMarker = new kakao.maps.Marker({
        position: position,
        title: "내 위치"
    });
    userMarker.setMap(map);
}

/**
 * Fetch station data from Opinet (Mocked for now)
 */
function fetchStations(lat, lng) {
    const listUl = document.getElementById('station-list');
    listUl.innerHTML = '<li class="loading">정보를 불러오는 중...</li>';

    // Simulate API delay
    setTimeout(() => {
        // In real app, this would be a fetch() call to a proxy server
        renderStations(mockStations);
        renderStationList(mockStations);
    }, 500);
}

function renderStations(stations) {
    // Clear existing markers
    stationMarkers.forEach(m => m.setMap(null));
    stationOverlays.forEach(o => o.setMap(null));
    stationMarkers = [];
    stationOverlays = [];

    stations.forEach(station => {
        const position = new kakao.maps.LatLng(station.lat, station.lng);
        
        // Custom Overlay for price
        const content = `<div class="price-overlay">${station.price.toLocaleString()}원</div>`;
        const customOverlay = new kakao.maps.CustomOverlay({
            position: position,
            content: content,
            yAnchor: 2.5
        });

        customOverlay.setMap(map);
        stationOverlays.push(customOverlay);

        // Standard Marker
        const marker = new kakao.maps.Marker({
            position: position,
            title: station.name
        });
        marker.setMap(map);
        stationMarkers.push(marker);

        kakao.maps.event.addListener(marker, 'click', () => {
            map.panTo(position);
            highlightListItem(station.id);
        });
    });
}

function renderStationList(stations) {
    const listUl = document.getElementById('station-list');
    const countSpan = document.getElementById('station-count');
    
    countSpan.textContent = `주유소 ${stations.length}개 발견`;
    listUl.innerHTML = '';

    const sortType = document.getElementById('sort-type').value;
    const sortedStations = [...stations].sort((a, b) => {
        if (sortType === 'price') return a.price - b.price;
        if (sortType === 'distance') return a.distance - b.distance;
        return 0;
    });

    sortedStations.forEach(station => {
        const li = document.createElement('li');
        li.className = 'station-item';
        li.dataset.id = station.id;
        li.innerHTML = `
            <div class="station-info">
                <h3>${station.name}</h3>
                <p>${station.brand} | ${station.distance}km</p>
            </div>
            <div class="station-price">
                <span class="price-value">${station.price.toLocaleString()}</span>
                <span class="price-unit">원</span>
                <div class="distance">${station.distance}km</div>
            </div>
        `;

        li.addEventListener('click', () => {
            const moveLatLon = new kakao.maps.LatLng(station.lat, station.lng);
            map.panTo(moveLatLon);
            map.setLevel(3);
        });

        listUl.appendChild(li);
    });
}

function highlightListItem(id) {
    const items = document.querySelectorAll('.station-item');
    items.forEach(item => {
        item.style.backgroundColor = item.dataset.id == id ? '#fff9c4' : '';
    });
    
    const target = document.querySelector(`.station-item[data-id="${id}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

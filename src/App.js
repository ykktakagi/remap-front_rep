import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import spotsData from './json/spotsData.json'; // JSONファイルをインポート
import 'leaflet/dist/leaflet.css'; // LeafletのCSSをインポート
import './surround_spot.css'; // カスタムCSSをインポート

function App() {
  const [map, setMap] = useState(null);
  const [activeCategory, setActiveCategory] = useState('公共'); // 最初は「公共」が選択されている
  const [isPanelOpen, setIsPanelOpen] = useState(false); // パネルの開閉状態
  const [visibleSpots, setVisibleSpots] = useState([]); // 表示されている施設リスト

  const markersRef = useRef([]);

  useEffect(() => {
    if (!document.getElementById('mapcontainer')._leaflet_id) {  // 地図が既に初期化されていないか確認
      const initialMap = L.map('mapcontainer').setView([35.7627519, 139.6814164], 15); // 初期位置を設定

      L.tileLayer('https://tile.openstreetmap.jp/{z}/{x}/{y}.png', {
        attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors",
        maxZoom: 19,
      }).addTo(initialMap);

      setMap(initialMap);
    }
  }, []);

  useEffect(() => {
    if (map) {
      markersRef.current.forEach(marker => map.removeLayer(marker)); // 既存のマーカーをすべて削除
      markersRef.current = [];

      const iconMappings = {
        "公共": "/icons/mapicon_num_public.png",
        "教育": "/icons/mapicon_num_education.png",
        "医療": "/icons/mapicon_num_medical.png",
        "買い物": "/icons/mapicon_num_shopping.png",
        "公園・自然": "/icons/mapicon_num_nature.png",
        "スポーツ": "/icons/mapicon_num_sports.png",
        "グルメ": "/icons/mapicon_num_gourmet.png",
        "文化・レジャー": "/icons/mapicon_num_recreation.png",
        "交通": "/icons/mapicon_num_transportation.png",
        "その他": "/icons/mapicon_num_other.png"
      };

      const newVisibleSpots = spotsData.filter(spot => spot.show_category === activeCategory);

      newVisibleSpots.forEach((spot) => {
        const lat = spot.spot_latitude;
        const lng = spot.spot_longitude;
        const iconUrl = iconMappings[spot.icon_category];

        if (lat && lng && iconUrl) {  // 緯度と経度が存在し、アイコンのURLがあるか確認
          const customIcon = L.divIcon({
            html: `<div class="custom-div-icon"><img src="${iconUrl}"><div class="spot-no">${spot.spot_no}</div></div>`,
            iconSize: [45, 45],
            iconAnchor: [16, 45],
            popupAnchor: [0, -35],
            className: ''
          });

          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
          marker.bindPopup(spot.spot_name);
          markersRef.current.push(marker);
        } else {
          console.error(`Invalid coordinates or missing icon URL for spot: ${spot.spot_name}`);
        }
      });

      setVisibleSpots(newVisibleSpots);
    }
  }, [map, activeCategory]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div>
      <div className="tabs-container">
        <div className="tabs">
          <div className="left-buttons">
            <button className={activeCategory === '公共' ? 'active' : ''} onClick={() => setActiveCategory('公共')}>公共</button>
            <button className={activeCategory === '教育' ? 'active' : ''} onClick={() => setActiveCategory('教育')}>教育</button>
            <button className={activeCategory === '医療' ? 'active' : ''} onClick={() => setActiveCategory('医療')}>医療</button>
            <button className={activeCategory === '買い物' ? 'active' : ''} onClick={() => setActiveCategory('買い物')}>買い物</button>
            <button className={activeCategory === '公園・自然' ? 'active' : ''} onClick={() => setActiveCategory('公園・自然')}>公園・自然</button>
            <button className={activeCategory === 'スポーツ' ? 'active' : ''} onClick={() => setActiveCategory('スポーツ')}>スポーツ</button>
            <button className={activeCategory === 'グルメ' ? 'active' : ''} onClick={() => setActiveCategory('グルメ')}>グルメ</button>
            <button className={activeCategory === '文化・レジャー' ? 'active' : ''} onClick={() => setActiveCategory('文化・レジャー')}>文化・レジャー</button>
            <button className={activeCategory === '交通' ? 'active' : ''} onClick={() => setActiveCategory('交通')}>交通</button>
            <button className={activeCategory === 'その他' ? 'active' : ''} onClick={() => setActiveCategory('その他')}>その他</button>
          </div>
          <button className="facility-list-button" onClick={togglePanel}>{isPanelOpen ? '施設リスト▲' : '施設リスト▼'}</button>
        </div>
        <div className={`side-panel ${isPanelOpen ? 'open' : ''}`}>
          <ul>
            {visibleSpots.map((spot, index) => (
              <li key={index}>
                <span className="spot-no">{spot.spot_no}</span>
                <span className="spot-name">{spot.spot_name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div id="mapcontainer"></div>
    </div>
  );
}

export default App;

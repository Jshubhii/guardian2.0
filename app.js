const { useState, useEffect, useRef } = React;

// Application data with Kedarnath information
const appData = {
  defaultMapCenter: [30.7346, 79.0669],
  defaultMapZoom: 13,
  alerts: [
    {
      id: 1,
      title: "Flash Flood Warning - Alaknanda River",
      description: "Heavy rainfall upstream causing rapid water level rise. Pilgrims and locals near riverbank should evacuate immediately.",
      location: "Alaknanda River Valley, Kedarnath",
      severity: "danger",
      timestamp: "2025-09-11T14:30:00Z"
    },
    {
      id: 2,
      title: "Landslide Risk Alert", 
      description: "Unstable terrain detected near Chorabari Glacier area. Avoid trekking routes until further notice.",
      location: "Chorabari Glacier Trek Route",
      severity: "high",
      timestamp: "2025-09-11T13:45:00Z"
    },
    {
      id: 3,
      title: "Weather Advisory - Heavy Snow",
      description: "Unexpected snowfall predicted above 3500m altitude. Pilgrims should carry warm clothing and avoid night travel.",
      location: "Kedarnath Temple Area", 
      severity: "caution",
      timestamp: "2025-09-11T12:00:00Z"
    },
    {
      id: 4,
      title: "Helicopter Service Disruption",
      description: "Low visibility conditions affecting helicopter operations to Kedarnath. Surface route recommended.",
      location: "Kedarnath Helipad",
      severity: "caution", 
      timestamp: "2025-09-11T11:15:00Z"
    },
    {
      id: 5,
      title: "Avalanche Watch",
      description: "High avalanche risk in upper reaches. All mountaineering activities suspended in the affected zones.",
      location: "Kedarnath Peak Climbing Routes",
      severity: "high",
      timestamp: "2025-09-11T10:00:00Z"
    }
  ],
  hazardZones: [
    {
      id: 1,
      center: [30.7346, 79.0669],
      radius: 1500,
      type: "flood_risk",
      severity: "high",
      name: "Flash Flood Risk Area",
      description: "Alaknanda Valley - High risk of flash floods due to heavy rainfall upstream. Immediate evacuation recommended for areas near riverbank.",
      safetyTips: "Move to higher ground immediately. Avoid crossing rivers. Follow evacuation routes.",
      color: "#dc2626"
    },
    {
      id: 2,
      center: [30.7290, 79.0610], 
      radius: 800,
      type: "landslide_zone",
      severity: "high",
      name: "High Risk Landslide Zone",
      description: "Chorabari Glacier Area - Unstable terrain with high probability of landslides. Trekking prohibited.",
      safetyTips: "Avoid all activities in this zone. Use alternative routes. Report ground movement.",
      color: "#ea580c"
    },
    {
      id: 3,
      center: [30.7400, 79.0720],
      radius: 1200, 
      type: "avalanche_zone",
      severity: "medium",
      name: "Avalanche Danger Zone",
      description: "High Altitude Areas - Moderate to high avalanche risk above 3500m. Mountaineering suspended.",
      safetyTips: "Stay below 3500m elevation. Avoid steep slopes. Check with authorities.",
      color: "#f59e0b"
    }
  ],
  hospitals: [
    {
      id: 1,
      name: "Kedarnath Health Center",
      coordinates: [30.7346, 79.0669],
      contact: "+91-1364-233108"
    },
    {
      id: 2, 
      name: "Gaurikund Primary Health Center",
      coordinates: [30.7167, 79.0500],
      contact: "+91-1364-233109"
    }
  ],
  shelters: [
    {
      id: 1,
      name: "Kedarnath Emergency Shelter", 
      coordinates: [30.7340, 79.0665],
      capacity: 500
    },
    {
      id: 2,
      name: "Gaurikund Relief Camp",
      coordinates: [30.7160, 79.0495],
      capacity: 300
    }
  ],
  chatbotCommands: {
    "help": {
      response: "🆘 **Aapda Mitra Help**\n\nCommands:\n• **sos** - Emergency assistance\n• **emergency** - Emergency contacts\n• **weather** - Weather alerts\n• **evacuation** - Evacuation routes\n• **medical** - Medical facilities\n\nEmergency: **108** or **1078**"
    },
    "sos": {
      response: "🚨 **EMERGENCY ACTIVATED**\n\n**Immediate Help:**\n• Uttarakhand Emergency: **1078**\n• National Emergency: **108**\n• Police: **100**\n\nStay calm. Help is coming!"
    },
    "emergency": {
      response: "📞 **Emergency Contacts**\n\n• Disaster Helpline: **1078**\n• Medical Emergency: **108** \n• Kedarnath Police: **+91-1364-233100**"
    },
    "weather": {
      response: "🌦️ **Weather Alerts**\n\n• Flash Flood Warning - Alaknanda River\n• Heavy Snow Alert - Above 3500m\n• Avalanche Watch - High altitude\n\nAvoid night travel."
    },
    "evacuation": {
      response: "🏃 **Evacuation Routes**\n\n• Kedarnath → Gaurikund → Sonprayag\n• Emergency Helipad: Temple Area\n\n**Shelters:**\n• Kedarnath Shelter (500 capacity)\n• Gaurikund Camp (300 capacity)"
    },
    "medical": {
      response: "🏥 **Medical Facilities**\n\n• Kedarnath Health Center\n• Gaurikund PHC (14 km)\n• Rudraprayag Hospital (75 km)"
    }
  },
  incidentTypes: ["Landslide", "Flash Flood", "Avalanche", "Medical Emergency", "Missing Person", "Other"],
  severityLevels: ["Low", "Medium", "High", "Critical"],
  mockUser: {
    name: "Priya Sharma",
    role: "Mountain Rescue Volunteer", 
    location: "Kedarnath Response Unit"
  }
};

// Icon components
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const AlertsIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const PlusIcon = ({ active }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const ChatIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const UserIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// MapView Component using Mapbox GL JS
const MapView = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize Mapbox map
      mapboxgl.accessToken = 'pk.eyJ1IjoianNodWJoaWkiLCJhIjoiY21pZnJiOWYxMDBiZDNjc2Rydmg3NHY1ayJ9.gdiQ_hSrrjMVMGHhqh1aNw';
      
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite view with streets
        center: [appData.defaultMapCenter[1], appData.defaultMapCenter[0]], // [lng, lat]
        zoom: appData.defaultMapZoom - 1,
        pitch: 45, // Add 3D tilt
        bearing: 0,
        antialias: true // Smooth edges
      });
      
      // Add navigation controls (zoom, rotation)
      map.addControl(new mapboxgl.NavigationControl(), 'top-left');
      
      // Add geolocate control for current location
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: true
      });
      map.addControl(geolocateControl, 'top-left');
      
      // Add scale control
      map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }), 'bottom-left');
      
      // Add terrain for 3D effect
      map.on('load', () => {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        
        // Add sky layer for better visibility
        map.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
      });
      
      mapInstanceRef.current = map;

      // Add hazard zones with detailed popups
      map.on('load', () => {
        appData.hazardZones.forEach((zone, index) => {
          // Add circle layer for each zone
          map.addSource(`zone-${zone.id}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [zone.center[1], zone.center[0]] // [lng, lat]
              }
            }
          });
          
          map.addLayer({
            id: `zone-circle-${zone.id}`,
            type: 'circle',
            source: `zone-${zone.id}`,
            paint: {
              'circle-radius': {
                stops: [
                  [0, 0],
                  [20, zone.radius / 20]
                ],
                base: 2
              },
              'circle-color': zone.color,
              'circle-opacity': 0.2,
              'circle-stroke-width': 2,
              'circle-stroke-color': zone.color
            }
          });
          
          // Add popup on click
          map.on('click', `zone-circle-${zone.id}`, () => {
            const popupContent = `<h3 style="color: #e2e8f0; font-weight: bold; margin-bottom: 8px;">${zone.name}</h3><p style="color: #e2e8f0; margin-bottom: 8px;">${zone.description}</p><div style="margin-top: 8px;"><strong style="color: #e2e8f0;">Safety Tips:</strong><br><span style="color: #e2e8f0; font-size: 12px;">${zone.safetyTips}</span></div>`;
            
            new mapboxgl.Popup({ className: 'custom-popup' })
              .setLngLat([zone.center[1], zone.center[0]])
              .setHTML(popupContent)
              .addTo(map);
          });
          
          // Change cursor on hover
          map.on('mouseenter', `zone-circle-${zone.id}`, () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', `zone-circle-${zone.id}`, () => {
            map.getCanvas().style.cursor = '';
          });
        });
      });

      // Add hospital markers
      map.on('load', () => {
        appData.hospitals.forEach(hospital => {
          const el = document.createElement('div');
          el.className = 'hospital-marker';
          el.innerHTML = '🏥';
          el.style.fontSize = '24px';
          el.style.cursor = 'pointer';
          
          const marker = new mapboxgl.Marker(el)
            .setLngLat([hospital.coordinates[1], hospital.coordinates[0]])
            .addTo(map);
          
          el.addEventListener('click', () => {
            new mapboxgl.Popup({ className: 'custom-popup' })
              .setLngLat([hospital.coordinates[1], hospital.coordinates[0]])
              .setHTML(`<h3 style="color: #e2e8f0; font-weight: bold;">🏥 ${hospital.name}</h3><p style="color: #e2e8f0;">Contact: ${hospital.contact}</p>`)
              .addTo(map);
          });
        });
      });

      // Add shelter markers
      map.on('load', () => {
        appData.shelters.forEach(shelter => {
          const el = document.createElement('div');
          el.className = 'shelter-marker';
          el.innerHTML = '🏠';
          el.style.fontSize = '24px';
          el.style.cursor = 'pointer';
          
          const marker = new mapboxgl.Marker(el)
            .setLngLat([shelter.coordinates[1], shelter.coordinates[0]])
            .addTo(map);
          
          el.addEventListener('click', () => {
            new mapboxgl.Popup({ className: 'custom-popup' })
              .setLngLat([shelter.coordinates[1], shelter.coordinates[0]])
              .setHTML(`<h3 style="color: #e2e8f0; font-weight: bold;">🏠 ${shelter.name}</h3><p style="color: #e2e8f0;">Capacity: ${shelter.capacity} people</p>`)
              .addTo(map);
          });
        });
      });

      // Get user location with custom ring structure
      const createUserLocationMarker = (coordinates) => {
        // Create custom user marker with rings
        const el = document.createElement('div');
        el.className = 'user-location-container';
        el.innerHTML = `
          <div class="user-location-ring-outer"></div>
          <div class="user-location-ring-inner"></div>
          <div class="user-location-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `;
        el.style.cssText = `
          width: 200px;
          height: 200px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `;
        
        // Style outer yellow ring
        const outerRing = el.querySelector('.user-location-ring-outer');
        outerRing.style.cssText = `
          position: absolute;
          width: 200px;
          height: 200px;
          border: 4px solid #f59e0b;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.15);
          animation: pulse-outer 2s ease-in-out infinite;
        `;
        
        // Style inner red ring
        const innerRing = el.querySelector('.user-location-ring-inner');
        innerRing.style.cssText = `
          position: absolute;
          width: 120px;
          height: 120px;
          border: 4px solid #ef4444;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          animation: pulse-inner 2s ease-in-out infinite 0.5s;
        `;
        
        // Style center location icon
        const centerIcon = el.querySelector('.user-location-icon');
        centerIcon.style.cssText = `
          position: absolute;
          width: 50px;
          height: 50px;
          background: #22d3ee;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4);
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        return el;
      };
      
      // Add animations to document
      if (!document.getElementById('user-location-animations')) {
        const style = document.createElement('style');
        style.id = 'user-location-animations';
        style.innerHTML = `
          @keyframes pulse-outer {
            0%, 100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.08);
              opacity: 0.4;
            }
          }
          @keyframes pulse-inner {
            0%, 100% {
              transform: scale(1);
              opacity: 0.9;
            }
            50% {
              transform: scale(1.12);
              opacity: 0.5;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = [position.coords.latitude, position.coords.longitude];
            setUserPosition(userPos);
            
            const el = createUserLocationMarker(userPos);
            const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
              .setLngLat([userPos[1], userPos[0]])
              .addTo(map);
            
            // Create popup with severity info
            const popup = new mapboxgl.Popup({ 
              offset: 25,
              className: 'custom-popup',
              closeButton: false
            })
              .setHTML(`
                <div style="padding: 8px;">
                  <h3 style="color: #e2e8f0; font-weight: bold; margin-bottom: 8px; font-size: 16px;">📍 Your Location</h3>
                  <div style="margin-bottom: 6px;">
                    <strong style="color: #f59e0b;">⚠️ Caution Zone:</strong>
                    <span style="color: #e2e8f0; font-size: 13px;"> 100m radius</span>
                  </div>
                  <div style="margin-bottom: 6px;">
                    <strong style="color: #ef4444;">🚨 High Risk Zone:</strong>
                    <span style="color: #e2e8f0; font-size: 13px;"> 60m radius</span>
                  </div>
                  <p style="color: #94a3b8; font-size: 12px; margin-top: 8px; margin-bottom: 0;">
                    Stay alert and monitor active warnings
                  </p>
                </div>
              `);
            
            // Show popup on hover
            el.addEventListener('mouseenter', () => {
              popup.addTo(map);
              marker.setPopup(popup);
              popup.addTo(map);
            });
            
            // Show popup on click
            el.addEventListener('click', () => {
              popup.addTo(map);
              marker.setPopup(popup);
              popup.addTo(map);
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            setUserPosition(appData.defaultMapCenter);
            
            const el = createUserLocationMarker(appData.defaultMapCenter);
            const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
              .setLngLat([appData.defaultMapCenter[1], appData.defaultMapCenter[0]])
              .addTo(map);
            
            const popup = new mapboxgl.Popup({ 
              offset: 25,
              className: 'custom-popup',
              closeButton: false
            })
              .setHTML(`
                <div style="padding: 8px;">
                  <h3 style="color: #e2e8f0; font-weight: bold; margin-bottom: 8px; font-size: 16px;">📍 Default Location</h3>
                  <div style="margin-bottom: 6px;">
                    <strong style="color: #f59e0b;">⚠️ Caution Zone:</strong>
                    <span style="color: #e2e8f0; font-size: 13px;"> 100m radius</span>
                  </div>
                  <div style="margin-bottom: 6px;">
                    <strong style="color: #ef4444;">🚨 High Risk Zone:</strong>
                    <span style="color: #e2e8f0; font-size: 13px;"> 60m radius</span>
                  </div>
                  <p style="color: #94a3b8; font-size: 12px; margin-top: 8px; margin-bottom: 0;">
                    Location access denied
                  </p>
                </div>
              `);
            
            el.addEventListener('mouseenter', () => {
              popup.addTo(map);
              marker.setPopup(popup);
              popup.addTo(map);
            });
            
            el.addEventListener('click', () => {
              popup.addTo(map);
              marker.setPopup(popup);
              popup.addTo(map);
            });
          }
        );
      } else {
        setUserPosition(appData.defaultMapCenter);
        
        const el = createUserLocationMarker(appData.defaultMapCenter);
        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([appData.defaultMapCenter[1], appData.defaultMapCenter[0]])
          .addTo(map);
        
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          className: 'custom-popup',
          closeButton: false
        })
          .setHTML(`
            <div style="padding: 8px;">
              <h3 style="color: #e2e8f0; font-weight: bold; margin-bottom: 8px; font-size: 16px;">📍 Default Location</h3>
              <div style="margin-bottom: 6px;">
                <strong style="color: #f59e0b;">⚠️ Caution Zone:</strong>
                <span style="color: #e2e8f0; font-size: 13px;"> 100m radius</span>
              </div>
              <div style="margin-bottom: 6px;">
                <strong style="color: #ef4444;">🚨 High Risk Zone:</strong>
                <span style="color: #e2e8f0; font-size: 13px;"> 60m radius</span>
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin-top: 8px; margin-bottom: 0;">
                Geolocation not supported
              </p>
            </div>
          `);
        
        el.addEventListener('mouseenter', () => {
          popup.addTo(map);
          marker.setPopup(popup);
          popup.addTo(map);
        });
        
        el.addEventListener('click', () => {
          popup.addTo(map);
          marker.setPopup(popup);
          popup.addTo(map);
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const centerOnUser = () => {
    if (userPosition && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [userPosition[1], userPosition[0]],
        zoom: 16
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="map-container" style={{ height: '100%', width: '100%' }}></div>
      
      <button
        onClick={centerOnUser}
        className="absolute top-4 right-4 z-[1000] bg-slate-800 hover:bg-slate-700 text-cyan-400 p-3 rounded-full center-location-btn"
        disabled={!userPosition}
      >
        <LocationIcon />
      </button>
    </div>
  );
};

// AlertsList Component
const AlertsList = () => {
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'danger': return 'severity-danger';
      case 'high': return 'severity-high';
      case 'caution': return 'severity-caution';
      default: return 'severity-caution';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-200 mb-6">Active Alerts - Kedarnath</h2>
        
        {appData.alerts.map(alert => (
          <div key={alert.id} className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <div className="flex items-start space-x-3">
              <div className={`severity-dot ${getSeverityClass(alert.severity)} mt-2`}></div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-200 mb-1">{alert.title}</h3>
                <p className="text-slate-400 text-sm mb-2">{alert.description}</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{alert.location}</span>
                  <span>{formatTime(alert.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ReportIncident Component
const ReportIncident = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: '',
    severity: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      alert('Incident reported successfully! Emergency services have been notified.');
      setShowModal(false);
      setIsSubmitting(false);
      setFormData({ incidentType: '', severity: '', description: '' });
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ incidentType: '', severity: '', description: '' });
  };

  const updateFormData = (field) => (e) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: e.target.value
    }));
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-cyan-400 rounded-full flex items-center justify-center mb-4">
            <PlusIcon />
          </div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Report Incident</h2>
          <p className="text-slate-400">Help us respond faster by reporting incidents in Kedarnath area</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
        >
          Report New Incident
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-200">Report Incident</h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-200"
                type="button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Incident Type</label>
                <select
                  value={formData.incidentType}
                  onChange={updateFormData('incidentType')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 form-select"
                  required
                >
                  <option value="">Select incident type</option>
                  {appData.incidentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Severity</label>
                <select
                  value={formData.severity}
                  onChange={updateFormData('severity')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 form-select"
                  required
                >
                  <option value="">Select severity</option>
                  {appData.severityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={updateFormData('description')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200 h-24 resize-none"
                  placeholder="Describe the incident..."
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-medium py-2 px-4 rounded-md transition-colors ${isSubmitting ? 'loading' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ChatBot Component with functional commands
const ChatBot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', content: '🙏 Namaste! I\'m Aapda Mitra, your emergency assistant for Kedarnath region. Type **help** for commands.' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    
    const command = input.toLowerCase().trim();
    const response = appData.chatbotCommands[command] || {
      response: `I don't recognize "${input}". Type **help** to see available commands.`
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: response.response }]);
    }, 500);
    
    setInput('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-cyan-400 text-slate-900' 
                  : 'bg-slate-800 text-slate-200'
              }`}>
                <div className="whitespace-pre-line text-sm">{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-600">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' for commands..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-200"
          />
          <button
            type="submit"
            className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 px-4 py-2 rounded-md transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// UserProfile Component
const UserProfile = () => {
  const handleLogout = () => {
    alert('Logged out successfully!');
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 border-2 border-cyan-400">
            <UserIcon />
          </div>
          <h2 className="text-xl font-bold text-slate-200">{appData.mockUser.name}</h2>
          <p className="text-slate-400">{appData.mockUser.role}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <h3 className="font-semibold text-slate-200 mb-3">Profile Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-200">{appData.mockUser.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <h3 className="font-semibold text-slate-200 mb-3">Emergency Contacts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Disaster Helpline:</span>
                <span className="text-slate-200">1078</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medical Emergency:</span>
                <span className="text-slate-200">108</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Police:</span>
                <span className="text-slate-200">100</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

// BottomNavigation Component
const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'alerts', icon: AlertsIcon, label: 'Alerts' },
    { id: 'report', icon: PlusIcon, label: 'Report', isCenter: true },
    { id: 'chatbot', icon: ChatIcon, label: 'Chat' },
    { id: 'profile', icon: UserIcon, label: 'Profile' }
  ];

  return (
    <div className="bottom-nav fixed bottom-0 left-0 right-0 h-20 flex items-center justify-around px-4 z-50">
      {navItems.map(item => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        
        if (item.isCenter) {
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="report-button w-16 h-16 bg-cyan-400 hover:bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 transition-all duration-200"
            >
              <IconComponent active={isActive} />
            </button>
          );
        }
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item flex flex-col items-center space-y-1 p-2 transition-colors ${
              isActive ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <IconComponent active={isActive} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <MapView key="home" />;
      case 'alerts':
        return <AlertsList key="alerts" />;
      case 'report':
        return <ReportIncident key="report" />;
      case 'chatbot':
        return <ChatBot key="chatbot" />;
      case 'profile':
        return <UserProfile key="profile" />;
      default:
        return <MapView key="default" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <main className="flex-1 pb-20 tab-content">
        {renderActiveTab()}
      </main>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
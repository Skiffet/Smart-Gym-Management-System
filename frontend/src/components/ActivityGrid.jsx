const TILES = [
  { src: '/image/aquatic.png', label: 'Aquatic Recovery', zoom: 'aquatic' },
  { src: '/image/cardio.png', label: 'Cardio Zone', zoom: 'default' },
  { src: '/image/climbing.png', label: 'Climbing Wall', zoom: 'default' },
  { src: '/image/strength.png', label: 'Strength & Power', zoom: 'strength' },
];

const imgClass = (zoom) => {
  if (zoom === 'aquatic') return 'activity-tile__img activity-tile__img--aquatic';
  if (zoom === 'strength') return 'activity-tile__img activity-tile__img--strength';
  return 'activity-tile__img';
};

const ActivityGrid = ({ className = '' }) => (
  <div className={`activity-grid activity-grid--row ${className}`.trim()}>
    {TILES.map((tile) => (
      <div key={tile.label} className="activity-tile">
        <div className="activity-tile__media">
          <img src={tile.src} alt={tile.label} loading="lazy" className={imgClass(tile.zoom)} />
        </div>
      </div>
    ))}
  </div>
);

export default ActivityGrid;

const TILES = [
  { src: '/image/aquatic.png', label: 'Aquatic', zoom: 'aquatic' },
  { src: '/image/cardio.png', label: 'Cardio', zoom: 'default' },
  { src: '/image/climbing.png', label: 'Climbing', zoom: 'default' },
  { src: '/image/strength.png', label: 'Strength', zoom: 'strength' },
];

const imgClass = (zoom) => {
  if (zoom === 'aquatic') return 'activity-tile__img activity-tile__img--aquatic';
  if (zoom === 'strength') return 'activity-tile__img activity-tile__img--strength';
  return 'activity-tile__img';
};

const ActivityGrid = ({ className = '' }) => (
  <div className={`activity-grid ${className}`.trim()}>
    {TILES.map((tile) => (
      <figure key={tile.label} className="activity-tile">
        <img src={tile.src} alt={tile.label} loading="lazy" className={imgClass(tile.zoom)} />
        <figcaption>{tile.label}</figcaption>
      </figure>
    ))}
  </div>
);

export default ActivityGrid;

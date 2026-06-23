import PropTypes from 'prop-types';
import './SpecsTable.scss';

const SPEC_LABELS = {
  brand: 'Brand',
  name: 'Name',
  description: 'Description',
  screen: 'Screen',
  resolution: 'Resolution',
  processor: 'Processor',
  mainCamera: 'Main camera',
  selfieCamera: 'Selfie camera',
  battery: 'Battery',
  os: 'OS',
  screenRefreshRate: 'Refresh rate',
};

function SpecsTable({ brand, name, description, specs }) {
  const rows = [
    ['brand', brand],
    ['name', name],
    ['description', description],
    ['screen', specs?.screen],
    ['resolution', specs?.resolution],
    ['processor', specs?.processor],
    ['mainCamera', specs?.mainCamera],
    ['selfieCamera', specs?.selfieCamera],
    ['battery', specs?.battery],
    ['os', specs?.os],
    ['screenRefreshRate', specs?.screenRefreshRate],
  ].filter(([, val]) => val);

  return (
    <section className="specs-table">
      <h2 className="specs-table__title">SPECIFICATIONS</h2>
      <dl className="specs-table__list">
        {rows.map(([key, value]) => (
          <div key={key} className="specs-table__row">
            <dt className="specs-table__label">{SPEC_LABELS[key]}</dt>
            <dd className="specs-table__value">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

SpecsTable.propTypes = {
  brand: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  specs: PropTypes.shape({
    screen: PropTypes.string,
    resolution: PropTypes.string,
    processor: PropTypes.string,
    mainCamera: PropTypes.string,
    selfieCamera: PropTypes.string,
    battery: PropTypes.string,
    os: PropTypes.string,
    screenRefreshRate: PropTypes.string,
  }),
};

SpecsTable.defaultProps = {
  brand: undefined,
  name: undefined,
  description: undefined,
  specs: undefined,
};

export default SpecsTable;

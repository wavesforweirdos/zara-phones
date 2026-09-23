import type { PhoneSpecs } from '../../types/phone';
import './SpecsTable.scss';

type SpecKey = 'brand' | 'name' | 'description' | keyof PhoneSpecs;

const SPEC_LABELS: Record<SpecKey, string> = {
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

interface SpecsTableProps {
  brand?: string;
  name?: string;
  description?: string;
  specs?: PhoneSpecs;
}

function SpecsTable({ brand, name, description, specs }: SpecsTableProps) {
  const rows = (
    [
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
    ] satisfies [SpecKey, string | undefined][]
  ).filter(([, val]) => val);

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

export default SpecsTable;

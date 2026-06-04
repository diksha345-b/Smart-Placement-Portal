import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

/**
 * Reusable, column-config driven table.
 *
 * columns: [{ key, header, render?(row), className? }]
 * data:    array of row objects
 * rowKey:  function(row) => unique key (defaults to row._id / index)
 */
const Table = ({ columns, data = [], loading = false, rowKey, emptyMessage = 'No records found' }) => {
  if (loading) return <Loader />;
  if (!data.length) return <EmptyState title="No data" message={emptyMessage} />;

  const getKey = rowKey || ((row, i) => row._id || row.id || i);

  return (
    <div className="table-wrap">
      <table className="table">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.headerClassName}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={getKey(row, i)} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className={col.className}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

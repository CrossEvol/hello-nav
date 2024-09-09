import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { type ColDef, ModuleRegistry } from '@ag-grid-community/core'
import { AgGridReact, type CustomCellRendererProps } from '@ag-grid-community/react'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-quartz.css'
import * as Checkbox from '@radix-ui/react-checkbox'
import { useMemo, useState } from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { MdRadioButtonUnchecked } from 'react-icons/md'
import { useBearStore } from '../../store'
import { type GridAppItem } from '../../store/bear-state'
import GridUploadZone from './grid-upload-zone'

ModuleRegistry.registerModules([ClientSideRowModelModule])

// Custom Cell Renderer (Display logos based on cell value)
const NavigationIconRenderer = (params: CustomCellRendererProps<AppItem, string>) => (
  <span style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center' }}>
    {params.value && (
      <img
        alt={`${params.value} Flag`}
        src={`${params.value}`}
        style={{
          display: 'block',
          width: '25px',
          height: 'auto',
          maxHeight: '50%',
          marginRight: '12px',
          filter: 'brightness(1.1)',
        }}
      />
    )}
    <GridUploadZone imageData="" setImageData={() => {}} />
  </span>
)

const CustomCheckBox = (params: CustomCellRendererProps<AppItem, boolean>) => (
  <Checkbox.Root className="CheckboxRoot" checked={true} onCheckedChange={e => params.setValue!(!params.value)} id="c1">
    <Checkbox.Indicator className="CheckboxIndicator">
      {params.value! ? (
        <FaRegCircleCheck className="text-blue-600" fontSize={20} />
      ) : (
        <MdRadioButtonUnchecked className="text-gray-400" fontSize={20} />
      )}
    </Checkbox.Indicator>
  </Checkbox.Root>
)

const NavigationAgGrid = () => {
  const navigations = useBearStore(state => state.getNavigationsForGrid())

  const [columnDefs, _setColumnDefs] = useState<ColDef<GridAppItem>[]>([
    { field: 'id', width: 80 },
    { field: 'name', width: 120 },
    { field: 'homepage', width: 240 },
    { field: 'repository', width: 260 },
    { field: 'icon', width: 400, cellRenderer: NavigationIconRenderer },
    { field: 'keywords' },
    {
      field: 'darkInvert',
      width: 120,
      editable: false,
      cellRenderer: CustomCheckBox,
    },
    { field: 'lessRadius', width: 120, editable: false, cellRenderer: CustomCheckBox },
    { field: 'hidden', width: 100, editable: false, cellRenderer: CustomCheckBox },
    { field: 'order', width: 80 },
    { field: 'categoryID', width: 150 },
  ])

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }
  }, [])

  return (
    <div className={'ag-theme-quartz'} style={{ height: 500 }}>
      <AgGridReact
        rowData={navigations}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />
    </div>
  )
}

export default NavigationAgGrid

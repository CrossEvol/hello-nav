import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { type ColDef, ModuleRegistry } from '@ag-grid-community/core'
import { AgGridReact, type CustomCellRendererProps } from '@ag-grid-community/react'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-quartz.css'
import { useMemo, useState } from 'react'
import { defaultIcon } from '../../assets/icons'
import { useBearStore } from '../../store'
import { type CategoryWithCount } from '../../store/bear-state'
import GridUploadZone from './grid-upload-zone'

ModuleRegistry.registerModules([ClientSideRowModelModule])

// Custom Cell Renderer (Display logos based on cell value)
const CategoryIconRenderer = (params: CustomCellRendererProps<CategoryWithCount, string>) => (
  <span style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center' }}>
    {params.value ? (
      <img
        alt={`${params.value} Flag`}
        src={`${params.value}`}
        style={{
          display: 'block',
          width: '24px',
          height: 'auto',
          maxHeight: '50%',
          marginRight: '12px',
          filter: 'brightness(1.1)',
        }}
      />
    ) : (
      <img src={defaultIcon} className="mr-3 size-6" />
    )}
    <GridUploadZone imageSrc={params.value!} setImageSrc={(icon: string) => params.setValue!(icon)} />
  </span>
)

const CategoryAgGrid = () => {
  const categories = useBearStore(state => state.getCategoriesWithCount())

  const [columnDefs, _setColumnDefs] = useState<ColDef<CategoryWithCount>[]>([
    { field: 'id', flex: 1 },
    { field: 'title', flex: 1, editable: true },
    { field: 'icon', width: 400, cellRenderer: CategoryIconRenderer, sortable: false },
    { field: 'order', flex: 1 },
    { field: 'count', flex: 1 },
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
        rowData={categories}
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

export default CategoryAgGrid

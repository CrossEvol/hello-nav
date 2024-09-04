import './index.less'

type ChildrenJSX = (value: { filterKey: string }) => JSX.Element

type ComponentJSX = (values: ContainWrapProp & { isSettingMode: boolean }) => JSX.Element

function WithError(Component: ComponentJSX, Children: ChildrenJSX) {
  const fun = ({ isError, filterKey, resultAppCount, ...props }: WithErrorProps) =>
    isError ? (
      <div className="err-message">
        <Children filterKey={filterKey}></Children>
      </div>
    ) : (
      <>
        <Component {...props} />
        {filterKey && <div className="result-tips">Total {resultAppCount} found</div>}
      </>
    )
  return fun
}

export default WithError

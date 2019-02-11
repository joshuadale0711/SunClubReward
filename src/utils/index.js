export const checkNextProps = (nextProps, props, property) => {
  if (nextProps[property] && !nextProps[property].isFetching && props[property].isFetching != nextProps[property].isFetching) {
    if (nextProps[property].response) {
      return true  
    } else {
      return 'empty'
    }
  }
  return false
}

export const filterBlackList = (blackList, params, addParamsList) => {
  let fullList = blackList
  if (addParamsList && addParamsList.length) fullList = [...fullList, ...addParamsList]
  if (!(blackList && blackList.length)) return params
  return params
    ? Object.entries(params)
      .filter(([key]) => !fullList.includes(key))
      .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
    : null; 
}

export const filterWhiteList = (whiteList, params, addParamsList) => {
  let fullList = whiteList
  if (addParamsList && addParamsList.length) fullList = [...fullList, ...addParamsList]
  if (!(whiteList && whiteList.length)) return params
  return params
    ? Object.entries(params)
      .filter(([key]) => fullList.includes(key))
      .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
    : {}; 
}

export const applyAdapter = (params, type, { adapterKeyParams, adapterValueParams }, whiteListParams, incomming) => {
  if (!params || typeof params != 'object' || !(adapterKeyParams && adapterKeyParams[type])) return params || null
  return filterWhiteList(
    whiteListParams[type],
    incomming
      ? Object.assign({}, ...Object.keys(params).map(key => params[key] == 0 || params[key] != '' ? ({[Object.keys(adapterKeyParams[type]).find(adapterParamKey => adapterKeyParams[type][adapterParamKey] == key) || key]: adapterValueParams[type] && adapterValueParams[type][key] && adapterValueParams[type][key](params[key]) || params[key]}) : null))
      : Object.assign({}, ...Object.keys(params).map(key => params[key] == 0 || params[key] != '' ? ({[adapterKeyParams[type][key] || key]: adapterValueParams[type] && adapterValueParams[type][key] && adapterValueParams[type][key](params[key]) || params[key] }) : null))
  )
}